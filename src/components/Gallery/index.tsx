import React, { useEffect, useRef, useState, useCallback } from "react";
import "./gallery.scss";
import ImageCard from "../ImageCard";
import { useGeneratePreview } from "../../hooks/useGeneratePreview";
import Loading from "../Loading";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFilter } from "../../hooks/useFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoading from "../SkeletonLoading";
import { LIMIT_LOAD_MORE } from "../../constants";
import ModalPreviewItem from "../ModalPreviewItem";
import { useImageCard } from "../../hooks/useImageCard";
import EmptyPage from '../EmptyPage'
import { checkUploadImageLayer } from '../../utils/index'

const Gallery = () => {
  const {
    isLoading,
    previewList,
    handleGeneratePreview,
    filterBadgeList,
    handleLoadMore,
    isHasMore,
    filterListRedux,
    previewDetailList,
    setIsHasMore,
    collectionSelectList,
    isShowLoadMore,
  } = useGeneratePreview();

  const {
    isShowModalPreviewItem,
    handleCloseModalPreview,
    indexPreviewDetailSelected,
    collection
  } = useImageCard();

  const { handleDeleteBadge, handleClearBadge, setBadgeHeight, badgeHeight } = useFilter();

  useEffect(() => {
    if(checkUploadImageLayer(collection?.layers)) {
      handleGeneratePreview();
    }
  }, []);

  // set loadmore after clear badge
  useEffect(() => {
    if (previewDetailList.length > previewList.length) {
      setIsHasMore(true);
    }
  }, [filterListRedux]);


  if(!checkUploadImageLayer(collection?.layers)) {
    return <EmptyPage textStatus="Please add the layers and upload your images."/>
  }


  // get height of box display badge
  const refBadge = useCallback((node) => {
    if (!node) return;
    setBadgeHeight(node.getBoundingClientRect().height + 121 + 35);
  }, []);

  // show loading
  if (previewList.length == 0) {
    return (
      <div className="wrap-btn-generate-preview">
        {isLoading ? <Loading /> : null}
      </div>
    );
  }

  const hasMore =
    filterBadgeList.length > 0
      ? filterListRedux.length > previewList.length
      : filterListRedux.length == previewList.length
        ? false
        : isHasMore;




  return (
    <div className="wrap-gallery">
      {filterBadgeList.length > 0 ? (
        <>
          {/* badge box */}
          <div className="badge-filter" ref={refBadge}>
            {filterBadgeList.map((i, index) => (
              <div className="badge" key={index}>
                <span>{i}</span>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="icon-close"
                  onClick={() => handleDeleteBadge(i)}
                />
              </div>
            ))}
            <p
              className="ml-3 hover:cursor-pointer text-blue-gray-700 hover:text-light-blue-900"
              onClick={() => handleClearBadge()}
            >
              Clear all
            </p>
          </div>
        </>
      ) : null}

      <div
        className="overscroll-contain"
        id="scrollableDiv"
        style={{
          height:
            filterBadgeList.length > 0
              ? `calc(100vh - ${badgeHeight}px)`
              : "calc(100vh - 121px)",
          overflow: "auto",
        }}
      >
        <InfiniteScroll
          dataLength={previewList.length}
          next={handleLoadMore}
          hasMore={hasMore}
          // loader={<div className="text-center my-5">Loading ...</div>}
          loader={null}
          scrollableTarget="scrollableDiv"
        >
          <div
            style={{
              minHeight:
                filterBadgeList.length > 0
                  ? `calc(100vh - ${badgeHeight + 44}px)`
                  : "calc(100vh - 121px)",
              margin: "15px",
            }}
          >
            <div className="gallery">
              {previewList &&
                previewList.map((item, index) => {
                  let isSelected = false;

                  if (collectionSelectList.includes(item.infoIndex)) {
                    isSelected = true;
                  }

                  return (
                    <ImageCard
                      key={index}
                      item={previewDetailList[item.infoIndex]}
                      indexPreviewDetail={item.infoIndex}
                      isSelected={isSelected}
                    />
                  );
                })}

              {isShowLoadMore
                ? [...Array(LIMIT_LOAD_MORE)].map((item, index) => (
                  <SkeletonLoading key={index} />
                ))
                : null}
            </div>
          </div>
        </InfiniteScroll>
      </div>

      <ModalPreviewItem
        collectionName={collection?.name}
        detail={previewDetailList[indexPreviewDetailSelected]}
        isShowModalPreviewItem={isShowModalPreviewItem}
        handleCloseModalPreview={handleCloseModalPreview}
      />

    </div>
  );
};

export default Gallery;
