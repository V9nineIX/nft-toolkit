import React, { useEffect, useState } from "react";
import { useNFTContract } from "../hooks/useContract";
import { displayCurrency, displayDecimal, formatDecimalEther } from "../utils/index";
import { ethers, utils } from "ethers";
import { isEmpty } from "lodash";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { setCollectionFiled } from '../redux/slices/collectionSlice'
import { useLocation } from "react-router-dom";
import { getImageBuild } from '../utils/index'
import { setMintComplete, setMintFiled } from '../redux/slices/mintSlice'
import { QUERY_MERKLE_PROOF } from '../hooks/index'
import { DEFAULT_MERKLE_ROOT } from '../constants/index'


const QUERY_NFT_BY_SMART_CONTRACT_ADDRESS = gql`
    query getNftBySmartContractAddress(
        $smartContractAddress: String,
        $offset: Int,
        $limit: Int,
        $filter: [FilterParam]
    ) {
        nftBySmartContractAddress(
          smartContractAddress: $smartContractAddress,
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
            isHasUpdate,
            imageUrl,
            metaUrl,
            nftStorageType,
            phase{
              phaseNumber,
              whiteListAddress,
            },
            layers{
               name,
               images{
                name
              }
            },
        }
    }`;


export const useMint = () => {

  const dispatch = useDispatch()

  const location = useLocation();
  const { search } = location
  const address = search.replace('?', '')

  const { collection } = useSelector((state: any) => state.collection);
  const { tokenList, isShowModalTokenList } = useSelector((state: any) => state.mint);

  const [isDataSmartContractNotFound, setIsDataSmartContractNotFound] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [phasesActive, setPhasesActive] = useState<any>({});
  const [totalSupply, setTotalSupply] = useState(0);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    type: "",
    isShow: false,
  });
  const [availableMint, setAvailableMint] = useState(0);
  const [isShowModalSelectWallet, setIsShowModalSelectWallet] = useState(false)


  const { nftType = "" } = collection

  // ====== smart contract ====== //
  const contract = useNFTContract(nftType, address);
  const { account } = useWeb3React();


  const { data = {}, loading, error, fetchMore } = useQuery(QUERY_NFT_BY_SMART_CONTRACT_ADDRESS, {
    variables: {
      smartContractAddress: address,
      offset: 0,
      limit: 10,
      filter: []
    },
    onCompleted: (data) => {
      if (!isEmpty(data?.nftBySmartContractAddress)) {
        let res = { ...data?.nftBySmartContractAddress }
        delete res["__typename"]

        dispatch(setCollectionFiled({
          key: 'collection',
          value: res
        }))
      } else {
        setIsDataSmartContractNotFound(true)
      }
    },
    fetchPolicy: 'network-only'
  });


  const [getMerkleProof] = useLazyQuery(QUERY_MERKLE_PROOF, {
    variables: {
      contractAddress: address,
      phaseNumber: phasesActive?.phaseNum,
      address: account
    }
  })



  useEffect(() => {
    if (contract && account) {
      watchEventMint()
      return () => {
        contract.removeAllListeners("TotalMint")
      }
    }
  }, [contract, account])


  const handleIncrementMintAmount = () => {
    setMintAmount((prevState) => prevState + 1);
  };

  const handleDecrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount((prevState) => prevState - 1);
    }
  };

  const handleClickMint = async () => {
    try {
      setIsShowLoading(true);

      let merkleProof = []
      if (phasesActive?.merkleRoot != DEFAULT_MERKLE_ROOT) {
        const res = await getMerkleProof()

        if (!isEmpty(res?.data?.getMerkleProof)) {
          merkleProof = res?.data?.getMerkleProof?.proof || []
        }
      }

      const price = phasesActive?.price
      const amount = mintAmount || 1
      const totalAmount = formatDecimalEther(price, amount)
      const totalPrice = utils.parseEther(totalAmount.toString());

      // mint
      const tx = await contract.mint(mintAmount, merkleProof, { value: totalPrice });
      await tx.wait();

      // get last mint 
      const tokenId_list = await contract.getLastedMintTransection(account)

      if (!isEmpty(tokenId_list)) {
        let tokenList = []
        const opensea = import.meta.env.VITE_OPEN_SEA_URL;

        for (const tokenId of tokenId_list) {
          const imgPath = getImageBuild(collection?.projectDir, tokenId.toString())
          const url = isEmpty(address) && isEmpty(tokenId_list) ? '#' : `${opensea}/${address}/${tokenId.toString()}`
          tokenList.push({ image: imgPath, url: url })
        }

        dispatch(setMintComplete({ tokenList: tokenList }))

        setIsShowLoading(false);
      }
    } catch (err) {
      console.log("err", err);
      setAlertMessage({
        message: "Minting failed. Please try again!",
        type: "error",
        isShow: true,
      });

      setTimeout(() => {
        setAlertMessage({
          ...alertMessage,
          isShow: false,
        });
      }, 5000);

      setIsShowLoading(false);
    }
  };

  const handleGetActivePhase = async () => {
    try {
      contract.getActivePhase().then((res) => {
        let obj = {};
        for (const [key, value] of Object.entries(res)) {
          const convertNumber = Number(key);
          if (isNaN(convertNumber)) {
            if (typeof value == "object") {
              if (key == "price") {
                const new_price = displayCurrency(value);
                obj["price"] = parseFloat(new_price);
              } else {
                const convertToDecimal = displayDecimal(value);
                obj[key] = convertToDecimal;
              }
            } else {
              obj[key] = value;
            }
          }
        }

        setPhasesActive(obj);
      });

      // ===== get total supply ===== //
      const totalSupply = await contract.totalSupply();
      setTotalSupply(displayDecimal(totalSupply));
    } catch (err) {
      console.log("error get active phases", err);
    }
  };

  const watchEventMint = () => {
    try {
      contract.on(
        "TotalMint",
        (
          phaseNum,
          phaseMintCount,
          availablePerWallet,
          totalSupply,
          TotalMint
        ) => {
          setTotalSupply(totalSupply.toString());
          setAvailableMint(availablePerWallet.toString());
        }
      );

    } catch (ex) {
      console.log("ex", ex);
    }
  };

  const handleGetMintAvailable = () => {
    try {
      contract.getMintAvailableAddress(account).then((res: any) => {
        setAvailableMint(res.toString());
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleCloseModalTokenList = () => {
    dispatch(setMintFiled({
      key: 'isShowModalTokenList',
      value: false
    }))
  }

  return {
    handleIncrementMintAmount,
    handleDecrementMintAmount,
    handleClickMint,
    mintAmount,
    handleGetActivePhase,
    phasesActive,
    totalSupply,
    contract,
    isShowLoading,
    alertMessage,
    availableMint,
    handleGetMintAvailable,
    collection,
    tokenList,
    isShowModalTokenList,
    handleCloseModalTokenList,
    account,
    isShowModalSelectWallet,
    setIsShowModalSelectWallet,
    isDataSmartContractNotFound,
  };
};
