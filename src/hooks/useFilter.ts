import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCollectionFiled,
  generatePreviewImage,
} from "../redux/slices/collectionSlice";
import { LIMIT_LOAD_INITIAL } from "../constants";
import { isEmpty } from 'lodash'
import { setExportFiled } from '../redux/slices/exportSlice'

export const useFilter = () => {
  const dispatch = useDispatch();

  const { collection, filterBadgeList, previewList, previewDetailList, filterLayerList } =
    useSelector((state: any) => state.collection);
  const { layers } = collection;

  const { exportFilterList } = useSelector((state:any) => state.export)

  const [layerSelectList, setLayerSelectList] = useState([]);
  const [badgeHeight, setBadgeHeight] = useState(0);

  const isEmportPage = !isEmpty(exportFilterList)

  // Open layer
  const handleOpen = (value) => {
    const isDuplicate = layerSelectList.some((i) => i == value);

    if (isDuplicate) {
      const res = layerSelectList.filter((i) => i !== value);
      setLayerSelectList(res);
    } else {
      setLayerSelectList((prevState) => [...prevState, value]);
    }
  };

  
  // Select checkbox
  const handleSelectFilter = (imgValue, layerValue) => {
    const isDuplicate = filterBadgeList.some((i) => i == imgValue.name);

    let res = []
    let arr = []
      if (isDuplicate) {
        // remove items are duplicate
        res = filterBadgeList.filter((i) => i !== imgValue.name);
        arr = filterLayerList.filter((i)=> i.split('.')[1] !== imgValue.name)
      } else {
        res = [...filterBadgeList, imgValue.name];
        arr = [...filterLayerList, `${layerValue}.${imgValue.name}`]
      }

    dispatch(
      setCollectionFiled({
        key: "filterLayerList",
        value: arr,
      })
    );


    dispatch(
      setCollectionFiled({
        key: "filterBadgeList",
        value: res,
      })
    );

    if(!isEmportPage) {
      // @ts-ignore
      dispatch(generatePreviewImage({ isFilter: true }));
    }
  };

  const handleDeleteBadge = (badgeItem) => {
    // remove badge duplicate
    const newBadge = filterBadgeList.filter((item) => item != badgeItem);

    if(!isEmpty(filterLayerList)) {
      const newLayer = filterLayerList.filter((item) => item.split('.')[1] !== badgeItem)
  
      dispatch(
        setCollectionFiled({
          key: "filterLayerList",
          value: newLayer,
        })
      );
    }

    dispatch(
      setCollectionFiled({
        key: "filterBadgeList",
        value: newBadge,
      })
    );

    if (newBadge.length > 0) {
      // @ts-ignore
      dispatch(generatePreviewImage({ isFilter: true }));
    } else {
      //  reset to initial
      initialCollection();
    }
  };

  const handleClearBadge = () => {
    if(!isEmpty(filterLayerList)) {
      dispatch(
        setCollectionFiled({
          key: "filterLayerList",
          value: [],
        })
      );
    }

    dispatch(
      setCollectionFiled({
        key: "filterBadgeList",
        value: [],
      })
    );

    //  reset to initial
    initialCollection();
  };

  const initialCollection = () => {
    //  reset to initial
    let newPreviewList = [];
    for (const [index, item] of previewDetailList.entries()) {
      if (index < LIMIT_LOAD_INITIAL) {
        newPreviewList.push({ infoIndex: index });
      }
    }

    dispatch(
      setCollectionFiled({
        key: "previewList",
        value: newPreviewList,
      })
    );
  };

  return {
    layerSelectList,
    handleOpen,
    layers,
    handleSelectFilter,
    filterBadgeList,
    handleDeleteBadge,
    handleClearBadge,
    badgeHeight,
    setBadgeHeight,
    previewList,
    previewDetailList,
    exportFilterList
  };
};
