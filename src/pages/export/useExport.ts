import { SLEEPY_API } from './../../constants/index';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql, useMutation } from "@apollo/client";
import { setExportFiled } from '../../redux/slices/exportSlice'
import { setCollectionFiled, setCollection } from '../../redux/slices/collectionSlice'
import { isEmpty } from 'lodash';
import { LIMIT_LOAD_INITIAL, CONTRACT_MERKLE_ROOT_TOKEN, DEFAULT_MERKLE_ROOT } from '../../constants/index';
import { setModalFiled } from '../../redux/slices/modalSlice'
import { Contract } from '@ethersproject/contracts'
import NFTABI from "../../abis/factory.json"
import { ethers } from 'ethers'
import { Collection } from '../../api/collection';
import { useFactoryContract, useERC721Contract } from '../../hooks/useContract';
import { getIdCollectionFromSearch } from '../../utils/index';

type Props = {}

const UPDATE_META_QTY = gql`
  mutation updateMetaQty($id: String, $metaQtyParam: [MetaQtyParam], $nftType: String) {
    updateMetaQty(id: $id, metaQtyParam: $metaQtyParam, nftType: $nftType)
  }
`;

export const useExport = (props: Props) => {
    const dispatch = useDispatch()
    const { ownerId } = useSelector((state: any) => state.application);
    const { collection, filterBadgeList } = useSelector((state: any) => state.collection);
    const { exportFilterList, isGoLaunch, isLoading } = useSelector((state: any) => state.export);
    const { isOpenModal, isShowModalReCreate, isShowModalUpdateMaxSupplySmartContact } = useSelector((state: any) => state.modal);

    const [isOpenModalSelectWallet, setIsOpenModalSelectWallet] = useState<boolean>(false)

    const [collectionId, setCollectionId] = useState<string>(getIdCollectionFromSearch())
    const [navMenuTab, setMenuTab] = useState<string>('Export')
    const [nft, setNft] = useState<any>({});
    const [isHasMore, setIsHasMore] = useState<boolean>(true);
    const [isShowQTY, setIsShowQTY] = useState(false)
    const [qtyUpdateList, setQtyUpdateList] = useState([])
    const [nftType, setNftType] = useState('')
    const [alertInfo, setAlertInfo] = useState({ status: false, message: '', type: '' })
    const [isShowLoading, setIsShowLoading] = useState(false)


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = useFactoryContract()
    const contractERC721 = useERC721Contract(collection?.smartContractAddress);

    const {
        _id,
        status,
    } = collection


    useEffect(() => {
        if (status != 'completed' && !isEmpty(_id)) {
            window.location.href = `/app/?id=${_id}`
        }
    }, [collection]);


    const QUERY_NFT = gql`
    query getNft(
        $id: String,
        $offset: Int,
        $limit: Int,
        $filter: [FilterParam]
    ) {
        nft(
            id: $id,
            offset: $offset,
            limit: $limit,
            filter: $filter
        ) {
            _id,
            name,
            ownerId,
            status,
            symbol,
            description,
            totalSupply,
            projectDir,
            royaltyFee,
            defaultPrice,
            imagePath,
            totalImage,
            nftType,
            ipfsJsonHash,
            ipfsImageHash,
            maxPublicSupply,
            maxTokensPerAddress,
            smartContractAddress,
            imageUrl,
            metaUrl,
            nftStorageType,
            phase{
                phaseNumber,
                whiteListAddress,
            },
            isHasUpdate,
            version {
                version,
                ipfsImageHash,
                ipfsJsonHash,
                buildFolder,
                totalSupply
            },
            meta{
              name,
              image,
              edition,
              rawImage,
              qty,
              attributes{
                trait_type,
                value
              },
              customAttributes{
                trait_type,
                value
              }
            },
            layers{
               name,
               images{
                name
              }
            },
        }
    }`;

    // loop for prepare filter params 
    let filterElement = []
    if (!isEmpty(filterBadgeList)) {
        for (const item of exportFilterList) {
            for (const imgName of item.images) {
                for (const badgeValue of filterBadgeList) {
                    if (badgeValue == imgName.name) {
                        const idx = filterElement.findIndex((value) => value.key == item.name)
                        if (idx < 0) {
                            filterElement.push({
                                key: item.name,
                                value: [badgeValue]
                            })
                        } else {
                            filterElement[idx].value.push(badgeValue)
                        }
                    }
                }
            }
        }
    }


    const { data = {}, loading, error, fetchMore } = useQuery(QUERY_NFT, {
        variables: {
            id: collectionId,
            offset: 0,
            limit: LIMIT_LOAD_INITIAL,
            filter: !isEmpty(filterBadgeList) ? filterElement : []
        },
        onCompleted: (data) => {
            if (!isEmpty(data)) {
                setNft({ ...data.nft })
                setIsHasMore(data?.nft?.totalImage > data?.nft?.meta?.length)
                let res = { ...data.nft }
                delete res["meta"]
                delete res["__typename"]
                dispatch(setCollectionFiled({
                    key: 'collection',
                    value: res
                }))


                if (isEmpty(exportFilterList)) {
                    dispatch(setExportFiled({
                        key: 'exportFilterList',
                        value: data?.nft?.layers
                    }))
                }
                setNftType(data?.nft?.nftType || "")
            }

            // =========== set to show input qty ===========
            if (data?.nft?.nftType === "ERC1155") {
                setIsShowQTY(true)
            } else {
                setIsShowQTY(false)
            }
        },
        fetchPolicy: 'network-only'
    });


    const [updateMetaQty] = useMutation(UPDATE_META_QTY, {
        onCompleted: (res) => {
            setAlertInfo({ status: true, message: 'update success', type: 'success' })

            setTimeout(() => {
                setAlertInfo((prevState) => ({ ...prevState, status: false }));
            }, 3000);


        },
        onError: (res) => {
            setAlertInfo({ status: true, message: 'Update Failed', type: 'error' })

            setTimeout(() => {
                setAlertInfo((prevState) => ({ ...prevState, status: false }));

            }, 3000);
        }
    });



    const getMoreQueryNFT = async () => {
        const currentLength = nft?.meta?.length || 1;
        const { data } = await fetchMore({
            variables: {
                offset: currentLength,
                limit: currentLength + LIMIT_LOAD_INITIAL,
                filter: !isEmpty(filterBadgeList) ? filterElement : []
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                const meta = [...nft?.meta, ...fetchMoreResult?.nft?.meta]
                const res = {
                    ...nft,
                    meta: meta,
                }

                setNft(res);
                setIsHasMore(res?.totalImage > res?.meta?.length)
            }
        });
    };


    const handleChangeNFTType = (value) => {
        if (value === 'ERC1155') {
            setIsShowQTY(true)
        } else {
            setIsShowQTY(false)
        }

        setNftType(value)
    }


    const handleChangeInputQTY = (e, index) => {
        const { value, name } = e.target

        let newQty = [...nft.meta]
        newQty[index] = { ...nft.meta[index], qty: parseInt(value) || 0 }

        const res = { ...nft, meta: newQty }
        setNft(res)


        const findIndex = qtyUpdateList.findIndex((o) => o.name === name);
        if (findIndex < 0) {
            qtyUpdateList.push(newQty[index]);
        } else {
            qtyUpdateList[findIndex].qty = parseInt(value) || 0
        }

        const sortQtyUpdate = qtyUpdateList.sort((a, b) => a.edition - b.edition)
        setQtyUpdateList(sortQtyUpdate)
    }

    const handleUpdate = async () => {
        try {
            let params = []
            let maxSupply = 0;
            for (const item of qtyUpdateList) {
                params.push({ edition: parseInt(item?.edition), qty: item?.qty })
            }

            updateMetaQty({
                variables: {
                    id: collectionId,
                    metaQtyParam: params,
                    nftType: nftType
                }
            })

            ///TODO update total supply;


            for (const metaItem of nft.meta) {
                maxSupply += metaItem.qty
            }


            const res = await Collection.updateCollectionById({
                collectionId: collectionId,
                data: { totalSupply: maxSupply }
            })

            //TODO update total supply in collection field

            setNft(prevState => ({
                ...prevState,
                totalSupply: maxSupply
            }
            ))
            // setNft({ ...data.nft ,totalSupply:  maxSupply })

            dispatch(setCollection({
                key: "totalSupply",
                value: maxSupply
            }))


        } catch (ex) {
            console.log("error", ex)
        }

    }


    const handleFocusInputQty = (e, index) => {
        const { value } = e.target

        let newQty = [...nft.meta]
        if (isEmpty(value)) {
            newQty[index] = { ...nft.meta[index], qty: 1 }
            const res = { ...nft, meta: newQty }
            setNft(res)
        }
    }


    const handleOpenModalSmartContract = () => {
        dispatch(setModalFiled({
            key: 'isOpenModal',
            value: true
        }))
    }

    const handleCloseModalSmartContract = () => {
        dispatch(setModalFiled({
            key: 'isOpenModal',
            value: false
        }))

        if (!isEmpty(collection?.smartContractAddress)) {
            handleCloseModalReCreate()
        }

    }


    const handleCloseModalReCreate = () => {
        dispatch(setModalFiled({
            key: 'isShowModalReCreate',
            value: false
        }))
    }

    const handleManageSmartContract = () => {
        dispatch(setExportFiled({
            key: 'isGoLaunch',
            value: true
        }))

        handleCloseModalReCreate()
    }


    const handleCreateSmartContract = async (data) => {
        const { defaultPrice = 0, name, symbol, maxPublicSupply, totalSupply, maxTokensPerAddress } = data

        const AbiCoder = ethers.utils.AbiCoder;
        const abiCoder = new AbiCoder();

        const accounts = await provider.send("eth_requestAccounts", []); // get account
        const jsonHash = (collection?.nftStorageType == 'custom' && collection?.metaUrl) ? `${collection?.metaUrl}` :
            collection?.ipfsJsonHash ? `ipfs://${collection?.ipfsJsonHash}` : ''


        let initArg1 = '';
        let initArg2 = '';

        let tokenIdList = []
        let amountList = []

        // convert ethers to wei
        const hexValue = ethers.utils.parseUnits(defaultPrice?.toString() || '0', 18)
        const WEI_VALUE = hexValue.toString()




        if (nftType == "ERC1155") {
            for (const item of nft?.meta) {
                tokenIdList.push(parseInt(item?.edition))
                amountList.push(item?.qty)
            }

            initArg1 = abiCoder.encode(['string', 'string', 'string', 'string', 'uint', 'uint'], [name, symbol, jsonHash + "/", '', maxPublicSupply, maxTokensPerAddress]);
            initArg2 = abiCoder.encode(['bool', 'uint', 'uint256[]', 'uint256[]', 'bytes32'], [true, WEI_VALUE, tokenIdList, amountList, DEFAULT_MERKLE_ROOT]);
        } else { //ERC721

            initArg1 = abiCoder.encode(['string', 'string', 'string', 'string', 'uint', 'uint', 'uint'], [name, symbol, jsonHash + "/", '', maxPublicSupply, totalSupply, maxTokensPerAddress]);
            initArg2 = abiCoder.encode(['bool', 'uint', 'bool', 'bytes32', 'bool'], [true, WEI_VALUE, true, DEFAULT_MERKLE_ROOT, true]);
            // bool revealed_,
            // uint price_,
            // bool disableRandomMint_,
            //bytes32  merkleRoot_
            // bool  disableOperatorFilter_


        }


        try {
            setIsShowLoading(true)
            const tx = await contract.cloneNFT(initArg1, initArg2, nftType)
            await tx.wait();

            const res = await contract.getLastedNftAddress(accounts[0])
            const result = await Collection.updateCollectionById({ collectionId, data: { "smartContractAddress": res } })


            if (!isEmpty(result?.data)) {
                dispatch(setCollectionFiled({
                    key: 'collection',
                    value: result?.data
                }))
                handleCloseModalSmartContract()
                setIsShowLoading(false)
            }

        } catch (ex) {
            console.log('error', ex);
            setIsShowLoading(false)

            setAlertInfo({ status: true, message: 'Failed to create. Please try again', type: 'error' })

            setTimeout(() => {
                setAlertInfo((prevState) => ({ ...prevState, status: false }));
            }, 5000);
        }
    }

    return ({
        navMenuTab,
        setMenuTab,
        filterBadgeList,
        isLoading: loading,
        filterListRedux: [],
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
        isGoLaunch,
        handleManageSmartContract,
        isLoadingExport: isLoading,
        isShowModalUpdateMaxSupplySmartContact,
        contract: contractERC721,
    })
}