import React from "react";
import { useSelector, useDispatch } from "react-redux";
import host from "../constants/host";
import { setCollectionFiled } from "../redux/slices/collectionSlice";
import { mergeTrait } from "../utils/index";

export const usePreview = () => {
  const dispatch = useDispatch();

  const { collection, collectionPreview } = useSelector(
    (state: any) => state.collection
  );
  const { layers } = collection;

  // ================== Preview ================== //
  const handlePreview = async () => {
    let imgList = [];  // merge image
    let newImages = []; // redux

    for (const item of layers) {
      // select trait index 0 by default
      if (item.images.length > 0) {
        imgList.push(host.baseImg + item.images[0].path);

        for (const [index, value] of item.images.entries()) {
          if (index == 0) {
            newImages.push({ ...value });
          }
        }
      }
    }

    dispatch(
      setCollectionFiled({
        key: "traitSelectedList",
        value: newImages,
      })
    );

    // call function merge image from util
    const response = await mergeTrait(imgList);

    dispatch(
      setCollectionFiled({
        key: "collectionPreview",
        value: response,
      })
    );
  };

  return {
    handlePreview,
    collectionPreview,
    layers,
  };
};
