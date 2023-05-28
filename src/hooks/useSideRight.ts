import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeAllCollectionSelectList,
  removeItemCollectionSelectList,
  setCollectionInfo,
  setCollectionFiled,
} from "../redux/slices/collectionSlice";
import { mergeTrait } from "../utils";
import { LIMIT_LOAD_INITIAL } from '../constants'

type Props = {};

export const useSideRight = (props: Props) => {
  const dispatch = useDispatch();
  const { collection, collectionSelectList, previewDetailList } = useSelector(
    (state: any) => state.collection
  );

  const handleClearAllSelectItem = () => {
    dispatch(removeAllCollectionSelectList());
  };

  const handleClearItemSelectItem = ({ index }) => {
    dispatch(removeItemCollectionSelectList({ index }));
  };

  const handleRemovePreviewDetailList = async () => {
    let newPreviewDetailList = [];
    for (const [index, value] of previewDetailList.entries()) {
      if (!collectionSelectList.includes(index)) {
        newPreviewDetailList.push(value);
      }
    }

    let newPreviewList = [];
    for (const [index, value] of newPreviewDetailList.entries()) {
      if (newPreviewList.length < LIMIT_LOAD_INITIAL) {
        if (!value.image) {
          const res = await mergeTrait(value.path);
          newPreviewDetailList[index] = { ...value, image: res };
        }
        newPreviewList.push({ infoIndex: index });
      }

      if (newPreviewList.length == LIMIT_LOAD_INITIAL) {
        break;
      }
    }

    dispatch(
      setCollectionInfo({
        previewDetailList: newPreviewDetailList,
        previewList: newPreviewList,
      })
    );

    dispatch(
      setCollectionFiled({
        key: "collectionSelectList",
        value: [],
      })
    );
  };

  return {
    collection,
    collectionSelectList,
    previewDetailList,

    handleClearAllSelectItem,
    handleRemovePreviewDetailList,
    handleClearItemSelectItem,
  };
};
