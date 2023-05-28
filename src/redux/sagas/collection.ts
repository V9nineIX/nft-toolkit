import { takeLatest, call, put, select, all, delay } from "@redux-saga/core/effects";
import {
  checkTraitValid,
  updateSelectTrait,
  generatePreviewImage,
  generateCollection,
  generatePreviewCollectionCustomToken,
} from "../slices/collectionSlice";
import {
  collectionState,
  updateImageCount,
  varidateTraitCount,
  calculateRarity,
  setCollectionFiled,
  setCollectionInfo,
  saveCollection
} from "../slices/collectionSlice";
import { calculateRarityInsideLayer } from "../../utils/rarityHelper";
import { checkUploadImageLayer, mergeTrait } from "../../utils/index";
import host from "../../constants/host";
import { startCreating } from "../../libs/genarate";
import { includes, isEmpty } from "lodash";
import { LIMIT_LOAD_INITIAL, DURATION_DISPLAY_ALERT } from "../../constants";
import { Collection } from '../../api/collection';
import { setModalFiled } from '../slices/modalSlice'
import { setAlertDetail, resetAlert } from '../slices/alertCardSlice'


export function* onCheckTraitValid(action: any) {
  const { payload } = action;
  const {
    value = 0,
    layerIndex = null,
    imageIndex = null,
    isRarityInput = false,
  } = payload;

  yield put(
    updateImageCount({
      rarity: value,
      layerIndex,
      imageIndex,
    })
  );

  yield call(onCalculateRarity, {
    payload: { isRarityInput, isTotalSupply: false },
  });
}

export function* onCalculateRarity(action: any) {
  const { payload } = action;

  // isTotalSupply is set rarity default
  // isRarityInput is calculate from input
  const { isRarityInput = false, isTotalSupply = false } = payload;

  const { collection } = yield select(collectionState);
  const { totalSupply, layers } = collection;


  let maximumTotalSupply = 1


  for (const [index, item] of layers.entries()) {

    maximumTotalSupply *= item.images.length

    const { detail, sumRarity } = calculateRarityInsideLayer({
      traitDetail: item.images,
      totalSupply: totalSupply,
      isRarityInput,
      isTotalSupply: isTotalSupply,
    });

    let newRarity: any = null

    if (detail) {
      for (const [idx, res] of detail.entries()) {
        // check the number is decimal
        const isDecimal = res.rarity % 1 != 0 ? true : false

        if (isTotalSupply) { // first time

          if (item.images[idx].rarity) { // if data from data base not null use lasted save data
            newRarity = Math.floor(item.images[idx].rarity)
          } else {
            newRarity = Math.floor(res.rarity) // round the decimal down
            const rarity_diff = 100 - sumRarity  // find the number different  

            if (idx < rarity_diff) { // distribue the number
              newRarity = Math.floor(res.rarity + 1)
            }
          }



        } else { // input value
          if (isDecimal) {
            const split = res.rarity.toString().split('.');

            // check decimal and fixed 2 position
            let decimal = null;
            if (split.length > 1) {
              decimal = split[0] + '.' + split[1].slice(0, 2);
            }

            newRarity = Number(decimal)

          } else {
            newRarity = Number(res.rarity)
          }
        }

        yield put(
          updateImageCount({
            count: res.count,
            layerIndex: index,
            imageIndex: idx,
            rarity: newRarity,
          })
        );

        yield put(
          varidateTraitCount({
            layerIndex: index,
            imageIndex: idx,
          })
        );
      }
    }
  }


  yield put(
    setCollectionFiled({
      key: "maximumTotalSupply",
      value: maximumTotalSupply,
    })
  );


}

export function* onUpdateSelectTrait(action: any) {
  const { payload } = action;
  const { layerIndex, imageIndex } = payload;

  const { collection, traitSelectedList } = yield select(collectionState);
  const { layers } = collection;

  // loop image for merge
  let res = [...layers];
  let traitSelected = [...traitSelectedList];

  for (const [idx, item] of res.entries()) {
    if (idx == layerIndex) {
      for (const [index, data] of item.images.entries()) {
        if (index == imageIndex) {
          traitSelected[idx] = { ...data };
        }
      }
    }
  }

  yield put(
    setCollectionFiled({
      key: "traitSelectedList",
      value: traitSelected,
    })
  );

  const imgList = traitSelected.map((item) => host.baseImg + item.path);

  // call function mergeImage
  const data = yield call(mergeTrait, imgList);

  yield put(
    setCollectionFiled({
      key: "collectionPreview",
      value: data,
    })
  );
}

export function* onGeneratePreviewCustomToken() {
  try {
    const {
      collection,
      customTokenAll,
    } = yield select(collectionState);

    const { totalImage = 0 } = customTokenAll

    // generate image
    if (checkUploadImageLayer(collection?.layers) && collection?.status != "completed") {
      // call preview
      yield call(onGeneratePreviewImage, {
        payload: { totalImage: totalImage || 0 },
      });

      // call generate
      yield call(onGenerateCollection);

    } else {
      /// custom token

      if (!isEmpty(customTokenAll?.meta)) {

        const res = Collection.updateCollectionById({
          collectionId: collection?._id,
          data: { status: "completed", totalSupply: totalImage }
        })


        res.then(function (result) {
          if (result?.data?.status == "completed") {
            window.location.href = window.location.href.replace('app', 'export')
          }
        })
      }

    }

  } catch (error) {
    console.log('error', error)
  }
}

export function* onGenerateCollection() {
  try {

    const {
      collection,
      elementList,
    } = yield select(collectionState);


    let paramCollection = { ...collection }
    const collectionId = paramCollection["_id"]

    delete paramCollection["createdAt"]
    delete paramCollection["updatedAt"]
    delete paramCollection["__v"]
    delete paramCollection["_id"]

    const param = {
      collection: paramCollection,
      layersElement: elementList,
      projectDir: paramCollection.projectDir,
      ownerId: paramCollection.ownerId,
      totalSupply: paramCollection.totalSupply
    }

    const res = Collection.generateCollection(collectionId, param);

  } catch (error) {
    console.log('error', error)
  }
}

export function* onGeneratePreviewImage(action: any) {

  const { payload } = action;
  const { isFilter = false, totalImage = 0 } = payload;
  const { previewList, elementList, filterBadgeList, previewDetailList } =
    yield select(collectionState);


  yield put(
    setCollectionFiled({
      key: "isLoading",
      value: true,
    })
  );

  if (previewList.length > 0) {
    yield put(
      setCollectionFiled({
        key: "previewList",
        value: [],
      })
    );
  }

  let newElementList = elementList;
  let list = previewList;

  if (!isFilter) {
    const { elementList: element, previewList: info } = yield call(creating, { totalImage: totalImage || 0 });
    newElementList = element;
    list = info;
  }

  // ============ filter =========== //
  let newPreviewList = [];
  let filterList = [];
  let newPreviewDetailList = [...previewDetailList];

  if (isFilter) {
    for (const [index, value] of previewDetailList.entries()) {
      for (const badge of filterBadgeList) {
        if (includes(value.dna, badge)) {
          if (newPreviewList.length < LIMIT_LOAD_INITIAL) {
            if (!value.image) {
              const res = yield call(mergeTrait, value.path);
              newPreviewDetailList[index] = { ...value, image: res };
            }
            newPreviewList.push({ infoIndex: index });
          }

          filterList.push(value); // list all of item is duplicate
        }
      }
    }

    yield put(
      setCollectionInfo({
        previewList: newPreviewList,
        filterList: filterList,
        previewDetailList: newPreviewDetailList,
      })
    );
  } else {
    let detail = [...list];
    let imgList = [];
    for (const [index, item] of detail.entries()) {
      if (index < LIMIT_LOAD_INITIAL) {
        // const res = yield call(mergeTrait, item.path);
        // detail[index].image = res;
        newPreviewList.push({ infoIndex: index });
        imgList.push(item.path);
      } else {
        break;
      }
    }

    const res = yield all(imgList.map((item) => call(mergeTrait, item)));

    for (const [index, item] of detail.entries()) {
      detail[index].image = res[index];

      if (index == LIMIT_LOAD_INITIAL) {
        break;
      }
    }

    yield put(
      setCollectionFiled({
        key: "filterBadgeList",
        value: [],
      })
    );

    yield put(
      setCollectionFiled({
        key: "collectionSelectList",
        value: [],
      })
    );

    yield put(
      setCollectionInfo({
        previewList: newPreviewList,
        elementList: newElementList,
        previewDetailList: detail,
      })
    );
  }

  yield put(
    setCollectionFiled({
      key: "isLoading",
      value: false,
    })
  );


}

function* creating({ totalImage = 0 }) {
  const { collection } = yield select(collectionState);
  const { layers,
    totalSupply,
    projectDir,
    name,
    symbol,
    description,
  } = collection;


  const layerConfigurations = [
    {
      growEditionSizeTo: totalSupply,
      layersOrder: layers,
    },
  ];
  // @ts-ignore
  const result = yield call(startCreating, {
    layerConfigurations: layerConfigurations,
    projectDir: projectDir,
    projectName: name,
    symbol: symbol,
    description: description,
    totalImage: totalImage,
  });

  return result;
}


function formatNumber(value) {
  // format number 1000000 to 1,234,567
  // \D matches any character that's not a digit (equivalent to [^0-9])
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}



export function* onSaveCollection(action: any) {

  const { collection } = yield select(collectionState)
  const { _id } = collection


  try {
    yield put(
      setModalFiled({
        key: "isShowModalLoading",
        value: true,
      })
    );


    let paramCollection = { ...collection }
    delete paramCollection["createdAt"]
    delete paramCollection["updatedAt"]
    delete paramCollection["__v"]
    delete paramCollection["_id"]
    const res = yield call(Collection.updateCollectionById, { collectionId: _id, data: paramCollection })


    if (!isEmpty(res?.data)) {
      yield put(
        setModalFiled({
          key: "isShowModalLoading",
          value: false,
        })
      );

      yield put(
        setAlertDetail({
          alertKey: 'UPDATE_SUCCESS'
        })
      );
      // yield delay(DURATION_DISPLAY_ALERT);
      // yield put(resetAlert());
    }
  } catch (err) {
    console.log('err', err);
    yield put(
      setModalFiled({
        key: "isShowModalLoading",
        value: false,
      })
    );

    yield put(
      setAlertDetail({
        alertKey: 'UPDATE_ERROR'
      })
    );
    // yield delay(DURATION_DISPLAY_ALERT);
    // yield put(resetAlert());

  }

}


export default function* watchSaga() {
  yield takeLatest(checkTraitValid.type, onCheckTraitValid);
  yield takeLatest(calculateRarity.type, onCalculateRarity);
  yield takeLatest(updateSelectTrait.type, onUpdateSelectTrait);
  yield takeLatest(generatePreviewImage.type, onGeneratePreviewImage);
  yield takeLatest(generateCollection.type, onGenerateCollection);
  yield takeLatest(generatePreviewCollectionCustomToken.type, onGeneratePreviewCustomToken);
  yield takeLatest(saveCollection.type, onSaveCollection);
}
