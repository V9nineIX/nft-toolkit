import { ICollectionListType } from "../models/collection.interface";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCollectionFiled,
  setCollectionList,
  setCollection,
} from "../redux/slices/collectionSlice";
import { Collection } from "../api/collection";
import { getLocalstorage, setWithExpiry } from "../utils/localstoageHelper";
import { sortBy } from "lodash";

type Props = {};

export const useCollectionList = (props: Props) => {
  const [isCreateCollection, setIsCreateCollection] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { collectionList } = useSelector((state: any) => state.collection);
  const { ownerId } = useSelector((state: any) => state.application);

  // const ownerId = "a3df5b9d-f74b-4732-9207-eb4074b2011f";



  const fetchCollection = async () => {
    if (ownerId) {
      // const localStorageOwnerId = getLocalstorage("ownerId")
      const localStorageOwnerId = ownerId;
      const resData = await Collection.getByOwnerId(localStorageOwnerId);

      let resCollectionList = resData.data;
      resCollectionList = sortBy(resCollectionList, "updatedAt").reverse();

      dispatch(setCollectionList({ collection: resCollectionList }));
    }

  };

  useEffect(() => {
    fetchCollection();
  }, []);

  useEffect(() => {
    if (isCreateCollection) {
      setIsCreateCollection(false);
      fetchCollection();
    }
  }, [isCreateCollection]);

  return {
    ownerId: ownerId,
    collectionList: collectionList,
    isCreateCollection: isCreateCollection,
    setIsCreateCollection: setIsCreateCollection,
  };
};
