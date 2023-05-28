import React, { Fragment, useCallback, useEffect } from 'react'
import "../Gallery/gallery.scss";
import ImageCard from "../ImageCard";
import { useGeneratePreview } from "../../hooks/useGeneratePreview";
import Loading from "../Loading";
import { faXmark, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFilter } from "../../hooks/useFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoading from "../SkeletonLoading";
import { LIMIT_LOAD_MORE } from "../../constants";
import ModalPreviewItem from "../ModalPreviewItem";
import { useImageCard } from "../../hooks/useImageCard";
import { useExport } from '../../pages/export/useExport';
import { ModalUploadIPFS } from '../ModalUploadIPFS';
import { Select, Option, Button } from "@material-tailwind/react";
import AlertCard from '../AlertCard'
import ModalAddSmartContract from '../ModalAddSmartContract'
import ModalSelectWallet from '../ModalSelectWallet'
import ModalLoading from '../ModalLoading'
import ModalMessage from '../ModalMessage'


type Props = {
}

export const ExportTab = ({ }: Props) => {

    const {
        navMenuTab,
        setMenuTab,
        filterBadgeList = [],
        isLoading = false,
        filterListRedux = [],
        nft, setNft,
        isHasMore, setIsHasMore,
        fetchMore,
        getMoreQueryNFT,
        collection,
        handleChangeNFTType,
        isShowQTY,
        handleChangeInputQTY,
        handleUpdate,
        handleFocusInputQty,
        alertInfo,
        handleOpenModalSmartContract,
        isOpenModal,
        isOpenModalSelectWallet,
        setIsOpenModalSelectWallet,
        handleCreateSmartContract,
        collectionId,
        isShowLoading,
        isShowModalReCreate,
        handleCloseModalSmartContract,
        handleCloseModalReCreate,
        handleManageSmartContract
    } = useExport({})


    const {
        isShowModalPreviewItem,
        handleCloseModalPreview,
        indexPreviewDetailSelected,
    } = useImageCard();


    const { handleDeleteBadge, handleClearBadge, setBadgeHeight, badgeHeight } = useFilter();

    const exportList = nft?.meta || []

    const reStructureDisplay = (item, isMergeAttributes = false) => {
        const api = import.meta.env.VITE_PUBLIC_API_BASE_URL
        const attributes = isMergeAttributes ? [...item?.attributes || [], ...item?.customAttributes || []] : item?.attributes || []
        const res = {
            ...item,
            attributes: attributes,
            image: `${api + item?.rawImage}`,
            name: item?.name,
        }

        return res
    }

    // get height of box display badge
    const refBadge = useCallback((node) => {
        if (!node) return;
        setBadgeHeight(node.getBoundingClientRect().height + 121 + 35);
    }, []);

    // show loading
    if (exportList?.length == 0 || isLoading) {
        return (
            <div className="wrap-btn-generate-preview">
                {isLoading ? <Loading /> : null}
            </div>
        );
    }

    const handleViewMetaData = () => {
        const api = import.meta.env.VITE_PUBLIC_API_BASE_URL
        const path = exportList[0]?.rawImage?.split('image')[0]
        window.open(`${api}${path}json/metadata.json`, '_blank')
    }

    return (
        <Fragment>
            <div className="w-full p-4 flex justify-between">
                <div>
                    <div className='flex gap-2'>
                        {collection?.smartContractAddress && (
                            <Button
                                className={`flex justify-content items-center gap-2`}
                                color="green"
                                onClick={() => {
                                    window.open(
                                        `https://goerli.etherscan.io/address/${collection?.smartContractAddress}`,
                                        '_blank'
                                    );
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Smart Contact
                            </Button>
                        )}
                        {collection?.ipfsJsonHash && (
                            <Button
                                className={`flex justify-content items-center gap-2`}
                                color="green"
                                onClick={() => {
                                    window.open(
                                        `https://ipfs.io/ipfs/${collection?.ipfsJsonHash}`,
                                        '_blank'
                                    );
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                IPFS
                            </Button>
                        )}

                        <Button onClick={()=> handleViewMetaData()}>
                            <FontAwesomeIcon icon={faFile} className="pr-2"/>
                            View metadata
                        </Button>
                    </div>
                </div>
                <div className='flex'>
                    <div className='mr-2'>
                        <Select variant="outlined" label="NFT Type" className="bg-white" value={nft?.nftType} onChange={(e) => handleChangeNFTType(e)}>
                            <Option value='ERC721'>ERC721</Option>
                            <Option value='ERC1155'>ERC1155</Option>
                        </Select>
                    </div>
                    <Button onClick={() => handleUpdate()}>Update</Button>
                </div>
            </div>
            <div className="wrap-gallery">
                {filterBadgeList?.length > 0 ? (
                    <>
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
                            filterBadgeList?.length > 0
                                ? `calc(100vh - ${badgeHeight + 72}px)`
                                : "calc(100vh - 193px)",
                        overflow: "auto",
                    }}
                >
                    <InfiniteScroll
                        dataLength={nft?.meta.length || 0}
                        next={getMoreQueryNFT}
                        hasMore={isHasMore}
                        loader={null}
                        scrollableTarget="scrollableDiv"
                    >
                        <div
                            style={{
                                minHeight:
                                    filterBadgeList?.length > 0
                                        ? `calc(100vh - ${badgeHeight + 44 + 72}px)`
                                        : "calc(100vh - 193px)",
                                padding: "15px",
                            }}
                        >
                            <div className="gallery">
                                {exportList && exportList.map((item, index) => {
                                    const resItem = reStructureDisplay(item)

                                    return (
                                        <ImageCard
                                            key={index}
                                            item={resItem}
                                            indexPreviewDetail={index}
                                            pageName="export"
                                            isShowQTY={isShowQTY}
                                            handleChangeInputQTY={handleChangeInputQTY}
                                            handleFocusInputQty={handleFocusInputQty}
                                        />
                                    );
                                })}

                                {isHasMore ? [...Array(LIMIT_LOAD_MORE)].map((item, index) => (
                                    <SkeletonLoading key={index} />
                                )) : null}
                            </div>
                        </div>
                    </InfiniteScroll>
                </div>

                <ModalPreviewItem
                    collectionName={nft?.name}
                    detail={exportList && reStructureDisplay(exportList[indexPreviewDetailSelected || 0], true)}
                    isShowModalPreviewItem={isShowModalPreviewItem}
                    handleCloseModalPreview={handleCloseModalPreview}
                />



                <AlertCard
                    message={alertInfo.message}
                    type={alertInfo.type}
                    isShow={alertInfo.status}
                />

                <ModalAddSmartContract
                    isOpen={isOpenModal}
                    handleOpen={handleCloseModalSmartContract}
                    data={nft}
                    collectionId={collectionId}
                    setIsOpenModalSelectWallet={setIsOpenModalSelectWallet}
                    handleCreateSmartContract={handleCreateSmartContract}
                />

                <ModalSelectWallet
                    isOpenModal={isOpenModalSelectWallet}
                    setIsOpenModal={setIsOpenModalSelectWallet}
                />

                <ModalLoading isShowLoading={isShowLoading} />

                <ModalMessage
                    isOpenModal={isShowModalReCreate}
                    content="You can safely make changes to your Minting Phases"
                    btnRight="Manage Smart contract"
                    btnText="I understand, I'd like to edit my Contract"
                    handleBtnText={handleOpenModalSmartContract}
                    handleBtnRight={handleManageSmartContract}  // redireact to launch tab
                    handleBtnLeft={handleCloseModalReCreate}
                />

            </div>
        </Fragment >
    )
}