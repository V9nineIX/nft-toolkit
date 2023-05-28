import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCollectionFiled,
  calculateRarity,
  setCollectionStatus,
  generateCollection,
  generatePreviewCollectionCustomToken,
  saveCollection
} from "../redux/slices/collectionSlice";
import { Collection } from "../api/collection";
import { getIdCollectionFromSearch } from '../utils/index';

type Props = {};

export const useCollection = (props: Props) => {
  const dispatch = useDispatch();
  const { collection, elementList, customTokenAll } = useSelector((state: any) => state.collection);
  const { isGoLaunch } = useSelector((state: any) => state.export);
  const { isShowModalLoading } = useSelector((state: any) => state.modal)
  const { alertMessage, isShowAlert, alertType } = useSelector((state:any) => state.alertCardSlice)

  const {
    name,
    symbol,
    description,
    defaultPrice,
    royaltyFee,
    totalSupply,
    layers,
    projectDir,
    _id: _idCollection,
  } = collection;

  const id = getIdCollectionFromSearch()
  const _id = _idCollection ? _idCollection : id

  const fetchCollectionById = async (id) => {
    const res = await Collection.getByCollectionId(id);
    const data = {
      ...res?.data[0],
      // totalSupply: 30,
    };


    dispatch(setCollectionFiled({ key: "collection", value: data }));

    // @ts-ignore
    dispatch(calculateRarity({ isRarityInput: false, isTotalSupply: true }));
  };

  //   useEffect(() => {
  //     const url = window.location.search;
  //     const id = url.split("id=")[1];

  //     fetchCollectionById(id);
  //   }, []);



  // onClick generate btn
  const handleGenerate = async (e) => {
    e.target.disabled = true
    let newCollection = { ...collection };
    delete newCollection["createdAt"]
    delete newCollection["updatedAt"]
    delete newCollection["__v"]
    delete newCollection["_id"]

    const payload = {
      collectionId: _id,
      projectDir: projectDir,
      collection: newCollection,
    };

    const res = await Collection.generateImage(_id, payload);
  };

  const handleSaveData = async () => {
    dispatch(saveCollection())
  };


  const handleGenerateCollectionCustom = async (e) => {

    try {
      // e.target.disabled = true
      dispatch(generatePreviewCollectionCustomToken())

    } catch (error) {
      // e.target.disabled = false
    }

  }

  const handleGenerateCollection = async (e) => {

    try {
      e.target.disabled = true
      dispatch(generateCollection())

    } catch (ex) {
      console.log(ex)
      e.target.disabled = e.target.disabled = false

    }

  }

  const updateCollectionStatus = (status) => {
    dispatch(setCollectionStatus({ status }))
  }



  return {
    handleGenerate,
    layers,
    totalSupply,
    handleSaveData,
    handleGenerateCollection,
    handleGenerateCollectionCustom,
    fetchCollectionById,
    updateCollectionStatus,
    elementList,
    collection,
    customTokenAll,
    isGoLaunch,
    isShowModalLoading,
    alertMessage,
    isShowAlert,
    alertType
  };
};
