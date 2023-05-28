import React, { useEffect } from "react";
import "./customToken.scss";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalUploadImage } from "../ModalUploadImage";
import { useCustomToken } from "../../hooks/useCustomToken";
import InfiniteScroll from "react-infinite-scroll-component";
import { ModalTraitCustom } from "../ModalTraitCustom/index";
import { useTraitCustom } from "../../hooks/useTraitCustom";
import { isEmpty } from 'lodash'
import { LIMIT_LOAD_MORE } from "../../constants";
import SkeletonLoading from "../SkeletonLoading";
import ModalMessage from "../ModalMessage";


const CustomToken = () => {
  const {
    collection,
    isOpenModal,
    projectDir,
    customTokenList,
    indexSelected,
    totalImage,
    setIsOpenModal,
    handleModal,
    handleLoadMore,
    handleSelectCustomToken,
    handleFetchCustomToken,
    getCustomToken,
  } = useCustomToken();

  const {
    isShowModalTraitCustom,
    setIsShowModalTraitCustom,
    handleModalTraitCustom,
    layersTrait,
    setLayersTrait,
    onChangeInputTraitCustom,
    handleAddTraits,
    handleDeleteCustomToken,
    handleRemoveCustomTraits,
    isErrorSave,
    isOpenModalDelete,
    handleDeleteMeta
  } = useTraitCustom({ meta: customTokenList[indexSelected] || [], getCustomToken: getCustomToken })

  const api = import.meta.env.VITE_PUBLIC_API_BASE_URL;

  useEffect(() => {
    handleFetchCustomToken();
  }, []);

  return (
    <div
      style={{ height: "calc(100vh - 121px)", overflow: "auto" }}
      id="coverCustomToken"
    >
      <InfiniteScroll
        dataLength={customTokenList?.length || 0}
        next={handleLoadMore}
        hasMore={totalImage > customTokenList?.length}
        loader={null}
        scrollableTarget="coverCustomToken"
      >
        <div className="wrap-custom-token m-10">
          <button
            className="custom-token-card aspect-square border-dashed border-2 border-slate-500 bg-white flex flex-col items-center justify-center shadow-md shadow-slate-300 hover:cursor-pointer hover:shadow-xl disabled:cursor-default"
            // disabled={collection.status == "completed"}
            onClick={() => { setIsOpenModal(true) }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="icon-plus text-slate-500"
            />
            <p className="text-[18px] text-slate-500 mt-5">Custom image</p>
          </button>

          {!isEmpty(customTokenList)
            ? customTokenList.map((item, index) => {

              return (
                <div
                  className="image-card aspect-square shadow-md shadow-slate-300 hover:cursor-pointer hover:shadow-xl"
                  key={index}
                  onClick={() => {
                    if (item?.tokenType == 'custom') {
                      setIsShowModalTraitCustom(true);
                      handleSelectCustomToken(index)
                    }
                  }}
                >
                  <img
                    src={`${api + item?.rawImage}`}
                  />
                </div>
              )
            })
            : null}

          {totalImage > customTokenList?.length ? [...Array(LIMIT_LOAD_MORE)].map((item, index) => (
            <SkeletonLoading key={index} height={'100%'} isImage={true} />
          )) : null}
        </div>
      </InfiniteScroll>

      <ModalUploadImage
        isShowModal={isOpenModal}
        handleOpen={handleModal}
        title="Add custom token"
        projectDir={projectDir}
        type="customToken"
      />

      <ModalTraitCustom
        isShowModal={isShowModalTraitCustom}
        handleOpen={handleModalTraitCustom}
        data={{
          layers: layersTrait,
          isErrorSave: isErrorSave,
          onChangeInputTraitCustom: onChangeInputTraitCustom,
          // imageCustomToken: "https://unsplash.it/0/0",
          // newLayersTrait: newLayersTrait,
          // setNewLayersTrait: setNewLayersTrait,
          handleAddTraits: handleAddTraits,
          handleDeleteCustomToken: handleDeleteCustomToken,
          handleRemoveCustomTraits: handleRemoveCustomTraits,
        }}
        meta={customTokenList[indexSelected]}
      />

      <ModalMessage
        isOpenModal={isOpenModalDelete}
        content="Delete this custom token?"
        btnLeft="cancel"
        btnRight="delete"
        btnRightColor="red"
        btnLeftColor="gray"
        handleBtnRight={() => handleDeleteMeta(customTokenList[indexSelected]?.edition)}
        handleBtnLeft={handleDeleteCustomToken}
      />
    </div>
  );
};

export default CustomToken;
