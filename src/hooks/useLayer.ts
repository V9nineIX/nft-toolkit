import { Collection } from './../api/collection';
import { calculateRarityInsideLayer } from "../utils/rarityHelper";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setLayerFiled,
  setTotalSupply,
} from "../redux/slices/layerSlice";
import { getIdCollectionFromSearch } from '../utils/index';
import {
  addLayerCollection,
  removeLayerImage,
  setCollection,
  setCollectionFiled,
  updateLayerImage,
  updateLayerName,
  updateImageName,
  checkTraitValid,
  updateImageCount,
  calculateRarity,
  updateSelectTrait
} from "../redux/slices/collectionSlice";

type addLayerProps = {
  value?: string;
  isAddLayerName: boolean;
};

export const useLayer = () => {
  const dispatch = useDispatch()
  const { isValid, } = useSelector((state: any) => state.layer)
  const { collection, currentSelectedLayerIndex, traitSelectedList, isCanUpdateTotalSupply, previewDetailList, maximumTotalSupply } = useSelector((state: any) => state.collection)
  const { totalSupply, layers, projectDir, ownerId, _id } = collection

  /* useState */

  const [inputLayerName, setInputLayerName] = useState<string>("");
  const [openModalAddLayer, setOpenModalAddLayer] = useState<boolean>(false);
  const [isNameExist, setIsNameExist] = useState<boolean>(false);

  const [openModalUploadImage, setOpenModalUploadImage] =
    useState<boolean>(false);

  const [inputTotalSupply, setInputTotalSupply] = useState<string>(totalSupply);

  /* useState */

  const handleAddLayer = (payload: any) => {
    dispatch(addLayerCollection(payload));
  };

  const handleCheckDuplicate = ({
    dataList = null,
    dataCheck = "",
  }: {
    dataList: any;
    dataCheck: any;
  }) => {
    const isDuplicate = dataList.some((item) => {
      return item.name === dataCheck;
    });
    return isDuplicate;
  };

  /* AddLayer */
  const handleOpenModalAddLayer = () => {
    setOpenModalAddLayer(!openModalAddLayer);
  };
  const handleCloseModalAddLayer = () => {
    setOpenModalAddLayer(false);
    setIsNameExist(false);
  };

  const handleModalAddLayer = ({
    value = "",
    isAddLayerName = false,
  }: addLayerProps) => {
    setIsNameExist(false);
    if (!isAddLayerName) {
      const isDuplicate = handleCheckDuplicate({
        dataList: layers,
        dataCheck: value,
      });

      if (!isDuplicate && value != "") {
        handleAddLayer({
          name: value,
          images: [],
          layerSelected: false,
          isValid: true,
        });
      }
    }

    handleOpenModalAddLayer();
  };

  const handleChangeLayerName = (e: { target: { value: any } }) => {
    setIsNameExist(false);
    let result = e.target.value.trim();
    const isDuplicate = handleCheckDuplicate({
      dataList: layers,
      dataCheck: result,
    });

    if (!isDuplicate && result != "") {
      setInputLayerName(result);
    } else if (isDuplicate && result != "") {
      setIsNameExist(true);
    }
  };

  const handleRemoveLayer = async ({ index = 0, item = {} }: { index?: number, item: any }) => {
    if (item._id) {
      try {
        const param = {
          "projectDir": projectDir,
          "nameLayer": item.name
        }
        await Collection.removeLayer(item._id, param);
      } catch (ex) {
        console.log('ex', ex)
      }
    }
    dispatch(removeLayerImage({ index: index }));
  };

  /* AddLayer */

  /* UploadImage */
  const handleOpenModalUploadImage = ({ index = 0 }: { index?: number }) => {
    setOpenModalUploadImage(!openModalUploadImage);

    dispatch(
      setCollectionFiled({
        key: "currentSelectedLayerIndex",
        value: index,
      })
    );
  };

  const handleCloseModalUploadImage = () => {
    setOpenModalUploadImage(false);
  };

  const handleModalUploadImage = (value: any) => {
    const resTraitDetailList = handleTraitDetail(value);
    dispatch(updateLayerImage(resTraitDetailList));
    handleCloseModalUploadImage();
  };

  const handleTraitDetail = (value: any) => {
    const { detail, sumRarity } = calculateRarityInsideLayer({
      traitDetail: value,
      totalSupply: totalSupply,
      isTotalSupply: true,
    });

    let newDetail = [...detail]
    for (const [idx, res] of newDetail.entries()) {
      res.rarity = Math.floor(res.rarity) // round the decimal down
      const rarity_diff = 100 - sumRarity  // find the number different  

      if (idx < rarity_diff) { // distribue the number
        res.rarity = Math.floor(res.rarity + 1)
      }
    }


    // let convert = detail.map((item: any) => {
    //   let resItem = { ...item };
    //   delete resItem["data_url"];
    //   delete resItem["file"];
    //   return {
    //     ...resItem,
    //     image: item.data_url,
    //     name: item.file.name,
    //     title: item.file.name.replace(".png", ""),
    //     traitSelected: false,
    //   };
    // });

    // return convert;
    return newDetail;
  };

  /* UploadImage */

  const handleChangeTotalSupply = (e) => {
    const { value } = e.target;

    dispatch(setCollection({ key: "totalSupply", value: value }));

    // @ts-ignore
    //dispatch(calculateRarity({ isRarityInput: false, isTotalSupply: true }));
  };


  const handleSelectTrait = (layerIndex, imageIndex) => {
    // @ts-ignore
    dispatch(updateSelectTrait({ layerIndex, imageIndex }))
  }


  return {
    layers,
    handleAddLayer,
    setLayerFiled,
    handleOpenModalAddLayer,
    handleCloseModalAddLayer,
    handleModalAddLayer,
    handleChangeLayerName,
    handleRemoveLayer,
    isNameExist,
    openModalAddLayer,
    inputLayerName,
    setInputLayerName,
    handleOpenModalUploadImage,
    handleCloseModalUploadImage,
    handleModalUploadImage,
    openModalUploadImage,
    inputTotalSupply,
    totalSupply,
    checkTraitValid,
    isValid,
    updateLayerName,
    handleChangeTotalSupply,
    currentSelectedLayerIndex,
    updateImageName,
    projectDir,
    ownerId,
    collectionId: _id || getIdCollectionFromSearch(),
    handleSelectTrait,
    traitSelectedList,
    isCanUpdateTotalSupply,
    previewDetailList,
    maximumTotalSupply,
  }
}
