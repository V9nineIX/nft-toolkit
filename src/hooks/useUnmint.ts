import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from 'react-redux';
import { LIST_TOKEN, DELETE_BULK_META, RESET_TOKEN } from "../hooks/index";
import { useERC721Contract } from "../hooks/useContract";
import { isEmpty } from "lodash";
import { setModalFiled } from "../redux/slices/modalSlice";
import { setExportFiled } from '../redux/slices/exportSlice'
import { RARE_COUNT } from '../constants/index';
import { setAlertDetail } from '../redux/slices/alertCardSlice';
import { setInCollection, setCollectionFiled } from "../redux/slices/collectionSlice";

export const useUnmint = () => {
  const dispatch = useDispatch()
  const { collection, filterLayerList } = useSelector((state: any) => state.collection);

  const { isSuccessUploadIPFS } = useSelector((state: any) => state.modal);
  const { isShowModalBurnToken } = useSelector((state: any) => state.modal);

  const { smartContractAddress, name, totalSupply, _id } = collection;

  const [removeNumber, setRemoveNumber] = useState("");
  const [tokenList, setTokenList] = useState(null);
  const [totalMint, setTotalMint] = useState(0);
  // const [maxSupply, setMaxSupply] = useState(0);
  const [paramFilter, setParamFilter] = useState([]);
  const [isHasMore, setIsHasMore] = useState(true)
  const [isInputOverLimit, setInputOverLimit] = useState(false)
  const [isOpenModalReset, setIsOpenModalReset] = useState(false)
  const [resetVersion, setResetVersion] = useState(null)


  const contract = useERC721Contract(smartContractAddress);
  const PAGE_LIMIT = 10;

  useEffect(() => {
    if (isSuccessUploadIPFS) {
      setTimeout(() => {
        dispatch(setModalFiled({ key: 'isShowModalUpdateMaxSupplySmartContact', value: true }))
      }, 1000);
    }
  }, [isSuccessUploadIPFS]);

  const [fetchTokenUnmint, { fetchMore, refetch }] = useLazyQuery(LIST_TOKEN, {
    variables: {
      limit: Number(totalMint) + PAGE_LIMIT,
      offset: Number(totalMint),
      id: _id,
      filter: [],
      startIndex: 0
    },
    onCompleted: (res) => {
      if (!isEmpty(res?.nft)) {
        setIsHasMore(true)
        setTokenList(res?.nft);

        let result = { ...res?.nft }
        delete result["meta"]
        delete result["__typename"]

        dispatch(setCollectionFiled({
          key: 'collection',
          value: result
        }))
      }
    },
    fetchPolicy: 'no-cache',
    nextFetchPolicy: 'no-cache'
  });

  const [restoreCollection] = useMutation(RESET_TOKEN, {
    variables: {
      id: _id,
      versionNumber: Number(resetVersion)
    },
    onCompleted: (data) => {
      if (data?.restoreCollection) {

        refetch()

        dispatch(setExportFiled({
          key: 'isLoading',
          value: false
        }))

        setIsOpenModalReset(false)

      }
    }
  })

  const [deleteBulkMeta] = useMutation(DELETE_BULK_META, {
    onCompleted: (res) => {
      const { deleteBulkMeta } = res

      dispatch(setModalFiled({ key: 'isShowModalBurnToken', value: false }))

      dispatch(setModalFiled({ key: 'isShowModalLoading', value: true }))


      if (!isEmpty(deleteBulkMeta) && deleteBulkMeta?.status && deleteBulkMeta?.totalSupply) {

        dispatch(
          setAlertDetail({
            alertKey: 'UPDATE_DELETE_BULK_SUCCESS'
          })
        )

        dispatch(setInCollection({
          data: {
            totalSupply: deleteBulkMeta?.totalSupply,
            isHasUpdate: true
          }
        }))

        dispatch(setModalFiled({ key: 'isShowModalLoading', value: false }))
        fetchTokenUnmint()

        setTimeout(() => {
          dispatch(setModalFiled({ key: 'isShowModalUploadIPFS', value: true }))
        }, 1000);

      } else {
        dispatch(setModalFiled({ key: 'isShowModalLoading', value: false }))
        dispatch(
          setAlertDetail({
            alertKey: 'UPDATE_DELETE_BULK_ERROR'
          })
        )
      }
    }
  });

  const handleDeleteBulkMeta = () => {
    deleteBulkMeta({
      variables: {
        id: _id,
        removeNumber: parseInt(removeNumber),
        excludedNumber: RARE_COUNT
      }
    })
  }

  const getTotalMint = async () => {
    try {
      const res = await contract.totalSupply();
      setTotalMint(res.toString());
    } catch (err) {
      console.log("err", err);
    }
  };

  // const getMaxSupply = async () => {
  //   try {
  //     const res = await contract.maxSupply();
  //     setMaxSupply(res.toString());
  //   } catch (err) {
  //     console.log("err", err);
  //   }
  // };

  const handleChangeNumberRemove = (e, avalibaleMint) => {
    const { value } = e.target;
    const removeNum = value.replace(/\D/g, "");

    if (Number(removeNum) > Number(avalibaleMint)) {
      setInputOverLimit(true)
    } else {
      setInputOverLimit(false)
    }

    setRemoveNumber(removeNum);
  };

  const handleClickRemove = () => {
    try {
      dispatch(setModalFiled({ key: 'isShowModalBurnToken', value: true }))
    } catch (error) {
      console.log(`error`, error);
      dispatch(setModalFiled({ key: 'isShowModalBurnToken', value: false }))
    }
  };

  const handleCallbackBurnToken = (e) => {
    try {
      if (e?.btnType == 'confirm') {
        //TODO upload ipsf
        handleDeleteBulkMeta()
      } else if (e?.btnType == 'cancel') {
        dispatch(setModalFiled({ key: 'isShowModalBurnToken', value: false }))
      }
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const reStructureDisplay = (item) => {
    const api = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    const res = {
      ...item,
      attributes: item?.attributes || [],
      image: `${api + item?.rawImage}`,
      name: item?.name,
    };

    return res;
  };

  const handleLoadMore = async () => {
    const res = await fetchMore({
      variables: {
        limit: Number(totalMint) + PAGE_LIMIT + tokenList?.meta.length,
        offset: Number(totalMint) + tokenList?.meta.length,
        id: _id,
        filter: paramFilter || [],
        startIndex: Number(totalMint)
      },
    });

    if (!isEmpty(res?.data?.nft)) {
      setTokenList({ ...tokenList, meta: [...tokenList?.meta, ...res?.data?.nft?.meta] });
      if (tokenList?.meta?.length >= (Number(totalSupply) - Number(totalMint))) {
        setIsHasMore(false)
      }
    }
  };


  const handleModalReset = () => {
    dispatch(setExportFiled({
      key: 'isLoading',
      value: true
    }))

    restoreCollection()
  }

  return {
    handleChangeNumberRemove,
    handleClickRemove,
    fetchTokenUnmint,
    getTotalMint,
    reStructureDisplay,
    handleLoadMore,
    setParamFilter,
    removeNumber,
    tokenList,
    totalMint,
    name,
    filterLayerList,
    smartContractAddress,
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
  };
};
