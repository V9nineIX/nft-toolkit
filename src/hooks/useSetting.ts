import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProjectInfo } from "../redux/slices/settingSlice";
import { setCollection } from "../redux/slices/collectionSlice";

export const useSetting = () => {
  const dispatch = useDispatch();

  const { collection } = useSelector((state: any) => state.collection);
  const { name = "", symbol = "", description = "", defaultPrice = "", royaltyFee = "", maxPublicSupply = "", maxTokensPerAddress = "", smartContractAddress = "" } = collection;

  const [inputSetting, setInputSetting] = useState({ name: name, symbol: symbol, description: description, defaultPrice: defaultPrice, royaltyFee: royaltyFee, maxPublicSupply: maxPublicSupply, maxTokensPerAddress: maxTokensPerAddress, smartContractAddress: smartContractAddress });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputSetting((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    dispatch(setCollection({ key: name, value: value }));
  };

  return {
    handleChange,
    inputSetting,
  };
};
