import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyQuery, gql } from "@apollo/client";
import { isEmpty } from "lodash";
import { LIMIT_LOAD_INITIAL } from '../constants/index'
import { Collection } from "../api/collection";
import { setCollectionFiled } from "../redux/slices/collectionSlice";
import { useDispatch } from "react-redux";

const QUERY_CUSTOM_TOKEN = gql`
  query customToken($id: String, $offset: Int, $limit: Int) {
    customToken(id: $id, offset: $offset, limit: $limit) {
      totalImage
      meta {
        name
        description
        image
        edition
        date
        attributes{
          trait_type,
          value
        }
        customAttributes{
          trait_type,
          value
        }
        rawImage
        dna
        tokenType
      }
    }
  }
`;

export const useCustomToken = () => {
  const dispatch = useDispatch()
  const { collection } = useSelector((state: any) => state.collection);
  const { projectDir, _id } = collection;

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [customTokenList, setCustomTokenList] = useState([]);
  const [indexSelected, setIndexSelected] = useState(-1);
  const [totalImage, setTotalImage] = useState(0)

  const handleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const [getCustomToken, { fetchMore }] =
    useLazyQuery(QUERY_CUSTOM_TOKEN, {
      variables: {
        id: _id,
        offset: 0,
        limit: LIMIT_LOAD_INITIAL,
      },
      onCompleted: (data) => {
        if (!isEmpty(data)) {
          setCustomTokenList(data?.customToken?.meta || []);
          setTotalImage(data?.customToken?.totalImage)
          dispatch(setCollectionFiled({
            key: 'customTokenAll',
            value: data?.customToken || []
          }))
        }
      },
      fetchPolicy: "network-only",
    });

  const handleFetchCustomToken = () => {
    getCustomToken();
  };

  const handleLoadMore = async () => {
    const currentLength = customTokenList.length || 1;
    const { data } = await fetchMore({
      variables: {
        offset: currentLength,
        limit: currentLength + LIMIT_LOAD_INITIAL,
      },
    });
    const { customToken } = data;
    const res = [...customTokenList, ...customToken?.meta];

    setCustomTokenList(res);
  };

  const handleSelectCustomToken = (index) => {
    setIndexSelected(index);
  };

  const handleUpdateCollectionStatus = async (id: string, status: string) => {
    const payload = {
      status: status
    }

    const result = await Collection.updateCollectionStatus(id, payload)
  }

  return {
    collection,
    isOpenModal,
    collectionId: _id,
    projectDir,
    customTokenList,
    indexSelected,
    totalImage,
    handleModal,
    setIsOpenModal,
    handleFetchCustomToken,
    handleLoadMore,
    handleSelectCustomToken,
    getCustomToken,
    handleUpdateCollectionStatus
  };
};
