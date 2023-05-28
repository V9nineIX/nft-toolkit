import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  generatePreviewImage,
  setCollectionInfo,
} from "../redux/slices/collectionSlice";
import { mergeTrait } from "../utils/index";
import { includes } from "lodash";
import { LIMIT_LOAD_MORE } from "../constants";

export const useGeneratePreview = () => {
  const dispatch = useDispatch();

  const {
    isLoading,
    isCanUpdateTotalSupply,
    previewList = [],
    filterBadgeList,
    elementList,
    previewDetailList = [],
    filterList: filterListRedux,
    collectionSelectList
  } = useSelector((state: any) => state.collection);

  const [isHasMore, setIsHasMore] = useState(true);
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);


  const handleGeneratePreview = async () => {
    // @ts-ignore
    dispatch(generatePreviewImage({ isFilter: false }));
  };

  const handleLoadMore = async () => {
    setIsShowLoadMore(true)
    
    // loadmore with filter
    if (filterBadgeList.length > 0) {
      if (previewList.length <= filterListRedux.length) {
        let i = 0;
        let newPreviewDetailList = [...previewDetailList];
        let newPreviewList = [];

        for (const [index, item] of previewDetailList.entries()) {
          for (const badge of filterBadgeList) {
            if (i == LIMIT_LOAD_MORE) {
              break;
            }

            if (includes(item.dna, badge)) {
              if (
                index > previewList[previewList.length - 1].infoIndex &&
                i < LIMIT_LOAD_MORE // get item by index > previous previewList
              ) {
                if (!item.image) {
                  const result = await mergeTrait(item.path);
                  newPreviewDetailList[index] = { ...item, image: result };
                }

                newPreviewList.push({ infoIndex: index });
                i++;
              }
            }
          }

          // exist from loop
          if (i == LIMIT_LOAD_MORE) {
            break;
          }
        }

        dispatch(
          setCollectionInfo({
            previewList: [...previewList, ...newPreviewList],
            previewDetailList: newPreviewDetailList,
          })
        );
      } else {
        setIsHasMore(false); //stop
      }
    } else {
      // ================= load more without filter ================= //
      if (previewList.length < previewDetailList.length) {
        setIsHasMore(true);
        let i = 0;
        let newPreviewDetailList = [...previewDetailList];
        let newPreviewList = [];
        for (const [index, item] of previewDetailList.entries()) {
          //exit loop
          if (i == LIMIT_LOAD_MORE) {
            break;
          }

          if (index >= previewList.length) {
            if (i < LIMIT_LOAD_MORE) {
              const result = await mergeTrait(previewDetailList[index].path);
              newPreviewDetailList[index] = { ...item, image: result };
              newPreviewList.push({ infoIndex: index });
              i++;
            } else {
              break;
            }
          }
        }

        dispatch(
          setCollectionInfo({
            previewList: [...previewList, ...newPreviewList],
            previewDetailList: newPreviewDetailList,
          })
        );
      } else {
        setIsHasMore(false);
      }
    }

    setIsShowLoadMore(false)
  };

  return {
    isLoading,
    isCanUpdateTotalSupply,
    previewList,
    handleGeneratePreview,
    filterBadgeList,
    elementList,
    handleLoadMore,
    isHasMore,
    previewDetailList,
    filterListRedux,
    setIsHasMore,
    collectionSelectList,
    isShowLoadMore
  };
};
