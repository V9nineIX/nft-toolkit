import React, { useEffect } from "react";
import Filter from "../Filter";
import ImageCard from "../ImageCard";
import { useUnmint } from "../../hooks/useUnmint";
import ModalPreviewItem from "../ModalPreviewItem";
import { useImageCard } from "../../hooks/useImageCard";
import { Button } from "@material-tailwind/react";
import InfiniteScroll from "react-infinite-scroll-component";
import Badge from "../Badge";
import { useFilter } from "../../hooks/useFilter";
import { findIndex, isEmpty } from "lodash";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalBurnToken } from '../ModalBurnToken/index';
import ModalMessage from '../ModalMessage/index'
import { Select, Option } from "@material-tailwind/react";

const UnmintTab = () => {
  const {
    handleChangeNumberRemove,
    handleClickRemove,
    fetchTokenUnmint,
    getTotalMint,
    // getMaxSupply,
    reStructureDisplay,
    handleLoadMore,
    setParamFilter,
    removeNumber,
    tokenList,
    totalMint,
    // maxSupply,
    name,
    filterLayerList,
    PAGE_LIMIT,
    isInputOverLimit,
    isShowModalBurnToken,
    handleCallbackBurnToken,
    setIsOpenModalReset,
    isOpenModalReset,
    handleModalReset,
    totalSupply,
    _id,
    isHasMore,
    setResetVersion,
    resetVersion
  } = useUnmint();

  const {
    isShowModalPreviewItem,
    handleCloseModalPreview,
    indexPreviewDetailSelected,
  } = useImageCard();

  const random = Math.random()

  const { handleDeleteBadge, handleClearBadge, filterBadgeList } = useFilter();

  useEffect(() => {
    fetchTokenUnmint();
    getTotalMint();
  }, []);

  useEffect(() => {
    if (filterLayerList.length > 0) {
      let filterParam = [];
      for (const meta of filterLayerList) {
        const [key, value] = meta.split('.')
        const keyIndex = findIndex(filterParam, { key: key });
        const traitValue = value.replaceAll("_", " ");

        if (keyIndex < 0) {
          filterParam.push({
            key: key,
            value: [traitValue],
          });
        } else {
          filterParam[keyIndex].value.push(traitValue);
        }
      }

      setParamFilter(filterParam);

      fetchTokenUnmint({
        variables: {
          id: _id,
          limit: Number(totalMint) + PAGE_LIMIT,
          offset: 0,
          filter: filterParam,
          startIndex: Number(totalMint)
        },
      });
    } else {
      setParamFilter([]);
      fetchTokenUnmint();
    }
  }, [filterLayerList]);


  if (isEmpty(tokenList)) {
    return null
  }


  const contentResetVersion = () => {
    return (
      <div className="flex flex-col">
        Are you sure you want to setting to default?

        <div className="w-full flex justify-between items-center mt-6 selectVersion">
          <span className="mr-3">Version: </span>
          <Select label="Select version" offset={10} value={resetVersion} onChange={(value) => setResetVersion(value)}>
            {tokenList?.version.map((item, index) =>
              <Option key={index} index={item?.version} value={item?.version.toString()}>
                {item?.version}
              </Option>
            )}
          </Select>
        </div>
      </div>
    )
  }


  return (
    <div className="flex h-[470px] w-full">
      <div className="max-h-[470px] w-[400px] overflow-y-auto border-r-2">
        <Filter isUnmintTab={true} filterList={tokenList?.layers} />
      </div>

      <div className="w-full py-2">
        {/* head */}
        <div className="flex justify-between items-center font-semibold px-4">
          <div>
            <span className="mr-[4rem]">Max supply: {totalSupply}</span>
            <span className="mr-[4rem]">Total mint: {totalMint}</span>
            <span>Available mint: {Number(totalSupply) - Number(totalMint)}</span>
          </div>

          <div>
            <div className="flex items-center">
              <div className="pr-3 cursor-pointer hover:text-blue" onClick={() => setIsOpenModalReset(!isOpenModalReset)}>
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                <span className="pl-1">Reset</span>
              </div>
              <div className="flex flex-col justify-center relative">
                <input
                  className={`border-[1px] rounded-md p-2 mr-3 focus:outline-0 ${isInputOverLimit ? "border-red" : ""
                    }`}
                  placeholder="ex. 100"
                  onChange={(e) => handleChangeNumberRemove(e, totalSupply - totalMint)}
                  value={removeNumber}
                />
                {isInputOverLimit && (
                  <span className={`text-red text-[11px] font-medium absolute top-[45px]`}>
                    Number is over remain max supply.
                  </span>
                )}
              </div>

              <Button
                color="red"
                onClick={() => handleClickRemove()}
                disabled={isInputOverLimit || Number(removeNumber) == 0}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        {/* content */}
        <div
          className={'py-2 px-2 mt-4 h-[402px] overflow-y-auto'}>
          <InfiniteScroll
            dataLength={tokenList?.meta?.length || 0}
            next={handleLoadMore}
            hasMore={isHasMore}
            loader={null}
            height={400}
          >
            <Badge
              filterBadgeList={filterBadgeList}
              handleDeleteBadge={handleDeleteBadge}
              handleClearBadge={handleClearBadge}
            />

            <div className="grid grid-cols-5 gap-4 p-2">
              {tokenList?.meta.map((item, index) => {
                const api = import.meta.env.VITE_PUBLIC_API_BASE_URL;
                const newItem = { ...item, image: `${api}${item?.rawImage}?r=${random}` };

                return (
                  <div className="drop-shadow-md" key={`key-${index}`}>
                    <ImageCard
                      item={newItem}
                      indexPreviewDetail={index}
                      pageName="export"
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <ModalPreviewItem
        collectionName={name || ""}
        detail={
          tokenList && reStructureDisplay(tokenList?.meta[indexPreviewDetailSelected])
        }
        isShowModalPreviewItem={isShowModalPreviewItem}
        handleCloseModalPreview={handleCloseModalPreview}
      />


      <ModalBurnToken
        isShowModal={isShowModalBurnToken}
        handleCallbackBurnToken={handleCallbackBurnToken}
      />

      <ModalMessage
        isOpenModal={isOpenModalReset}
        content={contentResetVersion()}
        btnLeft="cencel"
        btnRight="comfirm"
        btnLeftColor="gray"
        handleBtnLeft={() => {
          setIsOpenModalReset(!isOpenModalReset)
          setResetVersion('')
        }
        }
        handleBtnRight={() => handleModalReset()}
        btnRightDisable={isEmpty(resetVersion)}
      />
    </div>
  );
};

export default UnmintTab;
