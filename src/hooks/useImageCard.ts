import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCollectionFiled,
  setModalPreviewDetail,
} from "../redux/slices/collectionSlice";

export const useImageCard = () => {
  const dispatch = useDispatch();
  const {
    collectionSelectList,
    isShowModalPreviewItem,
    indexPreviewDetailSelected,
    collection
  } = useSelector((state: any) => state.collection);

  const handleSelectCard = (indexPreviewDetail: number) => {
    const isDuplicate = collectionSelectList.some(
      (item) => item == indexPreviewDetail
    );

    let newCollectionSelectList = [];
    if (isDuplicate) {
      newCollectionSelectList = collectionSelectList.filter(
        (item) => item != indexPreviewDetail
      );
    } else {
      let select = [...collectionSelectList];
      select.push(indexPreviewDetail);
      newCollectionSelectList = select;
    }

    dispatch(
      setCollectionFiled({
        key: "collectionSelectList",
        value: newCollectionSelectList,
      })
    );
  };

  const handleClickDetailButton = (e, indexPreviewDetail) => {
    e.stopPropagation();

    dispatch(
      setModalPreviewDetail({
        isShowModalPreviewItem: true,
        indexPreviewDetailSelected: indexPreviewDetail,
      })
    );
  };

  const handleCloseModalPreview = () => {
    dispatch(
      setModalPreviewDetail({
        isShowModalPreviewItem: false,
        indexPreviewDetailSelected: null,
      })
    );
  };

  return {
    handleSelectCard,
    handleClickDetailButton,
    handleCloseModalPreview,
    isShowModalPreviewItem,
    indexPreviewDetailSelected,
    collection
  };
};
