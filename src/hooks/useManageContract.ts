import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { displayDecimal, displayCurrency } from "../utils";
import { CONTRACT_MERKLE_ROOT_TOKEN, DEFAULT_MERKLE_ROOT } from "../constants";
import { useERC721Contract, useNFTContract } from '../hooks/useContract'
import { ethers } from 'ethers'
import { setModalFiled, setModalMinting } from "../redux/slices/modalSlice";
import { isEmpty, filter, join } from 'lodash';


import { setCollection, setCollectionFiled } from "../redux/slices/collectionSlice";
import { setActiveAirDrop, setExportFiled } from "../redux/slices/exportSlice";


import { useWeb3React } from "@web3-react/core";
import { handleMerkleTree } from '../utils/merkleTreeHelper';
import { Collection } from '../api/collection';


type dataType = {
  name: string,
  price: number,
  maxPublicSupply: number,
  maxTokensPerAddress: number,
  setIsFirstRender: any,
  whiteListAddress: Array<any>,
}


export const useManageContract = () => {
  const dispatch = useDispatch();
  const {
    collection,
    phasesList,
    phasesListSelected,
  } = useSelector((state: any) => state.collection);
  const { smartContractAddress, name, projectDir, totalSupply, nftType, phase } = collection;

  const contract = useNFTContract(nftType, smartContractAddress);

  const [contractDetail, setContractDetail] = useState({
    balanceOf: 0,
    totalSupply: 0,
    maxSupply: 0,
  });
  const [isShowLoading, setIsShowLoading] = useState(false)

  const { isShowModalMinting, typeModalMinting, indexModalMinting } = useSelector((state: any) => state.modal)
  const { activeAirDrop } = useSelector((state: any) => state.export)

  const { account } = useWeb3React();
  const [phaseWhiteList, setPhaseWhiteList] = useState(String)


  useEffect(() => {
    const res = filter(phase, { 'phaseNumber': Number(phasesListSelected?.phaseNum) });
    const whiteListAddressStr = res[0]?.whiteListAddress <= 0 ? '' : join(res[0]?.whiteListAddress, '\r\n')
    setPhaseWhiteList(whiteListAddressStr)
  }, [phasesListSelected]);

  useEffect(() => {
    fetchIsAirdropActive().then(function (result) {
      dispatch(setExportFiled({
        key: 'activeAirDrop',
        value: result,
      }))
    })
  }, []);

  const fetchIsAirdropActive = async () => {
    return await contract.isAirdropActive();
  }


  async function handleStatusActiveAirDrop() {
    try {
      setIsShowLoading(true)
      const res = await contract.setAirdropActive(!activeAirDrop);
      await res.wait()
      dispatch(setActiveAirDrop({}))
      if (!isEmpty(res)) {
        setIsShowLoading(false)
      }
    } catch (error) {
      console.log(`error`, error)
      setIsShowLoading(false)
    }
  }

  const handleSelectPhases = async (phasesNum: number, value: any, index: number, phaseStatus: number) => {
    const status = value == 'Start' ? 1 : value == 'Pause' ? 2 : value == 'End' ? 3 : 0

    // update phases status in state
    let newPhase = [...phasesList]
    newPhase[index] = { ...newPhase[index], status: status }

    dispatch(setCollectionFiled({
      key: 'phasesList',
      value: newPhase,
    }))

    try {
      setIsShowLoading(true)
      const res = await contract.setPhaseStatus(phasesNum, status)
      await res.wait()

      if (!isEmpty(res)) {
        setIsShowLoading(false)
      }
    } catch (err) {
      console.log('err', err);
      if (err.code == 'ACTION_REJECTED') {
        // update status back to initial
        let newPhasesList = [...phasesList]
        newPhasesList[index] = { ...newPhasesList[index], status: phaseStatus }

        dispatch(setCollectionFiled({
          key: 'phasesList',
          value: newPhasesList,
        }))

      }
      setIsShowLoading(false)
    }
  };

  const getSmartContractDetail = async () => {
    try {
      // get max supply
      const maxSupply = await contract.maxSupply();

      // get balanceOf
      const balanceOf = await contract.getBalance();
      const balance = ethers.utils.formatEther(balanceOf)

      // get totalSupply
      const totalSupply = await contract.totalSupply();

      setContractDetail({
        maxSupply: displayDecimal(maxSupply),
        balanceOf: Number(balance),
        totalSupply: displayDecimal(totalSupply),
      });
    } catch (err) {
      console.log('error smart contract detail', err);
    }
  };


  const fetchSmartContract = async () => {
    try {


      await handleGetAllPhase()
      await getSmartContractDetail()

    } catch (error) {
      console.log('error fetch smart contract', error)

      dispatch(setModalFiled({
        key: 'isShowModalLoading',
        value: false
      }))

    }
  }

  const handleMinting = ({
    handleTypeModal = 'Add', /* handleType= 'add'||'edit */
    index = -1,
  }) => {
    dispatch(setCollectionFiled({
      key: 'phasesListSelected',
      value: phasesList[index] || null,
    }))
    dispatch(setModalMinting({
      "isShowModalMinting": true,
      "typeModalMinting": handleTypeModal,
    }))
  }


  const handleCallbackModalMinting = async ({ handleType = "", data = null }: { handleType: any, data: dataType }) => {

    let res = null;
    try {
      if (handleType == "handleConfirm") {
        dispatch(setModalFiled({
          key: 'isShowModalLoading',
          value: true
        }))

        if (!!data) {
          const {
            name,
            price,
            maxPublicSupply,
            maxTokensPerAddress,
            whiteListAddress,
          } = data

          const hexValue = ethers.utils.parseUnits(price.toString(), 18)
          const PRICE = hexValue.toString()
          const addressWhiteList = [...whiteListAddress]

          const { root = '', proofs = [], tree = '' } = handleMerkleTree({
            address: addressWhiteList,
            account: account,
            isGetProof: true,
          })


          if (typeModalMinting == 'Add') {
            res = await contract.addPhase(name, maxPublicSupply, maxTokensPerAddress, root, false, PRICE)/* name_,maxSupply_,maxPerWallet_,merkleRoot_,isActive_,price_ */
            console.log('Add res', res)
          } else if (typeModalMinting == 'Edit') { //Edit
            res = await contract.updatePhase(name, maxPublicSupply, maxTokensPerAddress, root, false, PRICE, phasesListSelected?.phaseNum)/* name_,maxSupply_,maxPerWallet_,merkleRoot_,isActive_,price_,numPhase_ */
            console.log('Edit res', res)
          }

          await res?.wait()

          const resSetPhase = await Collection.setPhase(collection?._id,
            {
              phaseNumber: typeModalMinting == 'Add' ? phase?.length <= 0 ? 2 : phase?.length + 1 : phasesListSelected?.phaseNum,
              whiteListAddress: addressWhiteList
            }
          )

          dispatch(setCollection({
            key: 'phase',
            value: resSetPhase?.data?.phase
          }))

          await fetchSmartContract()

          dispatch(setModalMinting({
            "isShowModalMinting": false,
            "typeModalMinting": '',
            "isShowModalLoading": false,
          }))
        }

      } else {
        dispatch(setModalMinting({
          "isShowModalMinting": false,
          "typeModalMinting": '',
          "isShowModalLoading": false,
        }))
      }
    } catch (error) {
      console.log('error callback modal minting', error)
      dispatch(setModalMinting({
        "isShowModalMinting": false,
        "typeModalMinting": '',
        "isShowModalLoading": false,
      }))
    }
    data?.setIsFirstRender(true)

  }

  const handleGetAllPhase = () => {
    try {
      let newRes = [];

      contract.getAllPhase().then((res) => {

        for (const [index, value] of res.entries()) {
          let obj = {};
          for (const [key, data] of Object.entries(value)) {
            const convertNumber = Number(key);

            if (isNaN(convertNumber)) {
              if (typeof data == "object") {
                if (key == "price") {
                  const new_price = displayCurrency(data, 10);
                  obj["price"] = parseFloat(new_price);
                } else {
                  const convertToDecimal = displayDecimal(data);
                  obj[key] = convertToDecimal;
                }
              } else {
                obj[key] = data;
              }
            }


          }
          newRes.push(obj);
        }


        dispatch(setCollectionFiled({
          key: 'phasesList',
          value: newRes
        }))

      });

    } catch (err) {
      console.log('error get all phases', err);
    }
  }

  const handleWithdraw = async () => {
    try {
      const res = await contract.withdraw()
      const balanceOf = await contract.getBalance();

      setContractDetail({
        ...contractDetail,
        balanceOf: displayDecimal(balanceOf)
      })
    } catch (err) {
      console.log('err handle withdraw', err);
    }
  }

  const handleCheckbox = (index) => {
    // if(phasesSelected == index) {
    //   setPhasesSelected(-1)
    // } else {
    //   setPhasesSelected(index)
    // }
  }


  return {
    handleSelectPhases,
    contract,
    phasesList,
    phasesListSelected,
    smartContractAddress,
    name,
    projectDir,
    contractDetail,
    setContractDetail,
    getSmartContractDetail,
    handleMinting,
    handleCallbackModalMinting,
    isShowModalMinting,
    typeModalMinting,
    handleGetAllPhase,
    handleWithdraw,
    handleCheckbox,
    isShowLoading,
    totalSupplyRedux: totalSupply,
    whiteListAddress: phaseWhiteList || '',
    activeAirDrop,
    handleStatusActiveAirDrop,
  };
};
