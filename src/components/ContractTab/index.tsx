import React, { Fragment, useEffect } from "react";
import { Button, Checkbox, Select, Option } from "@material-tailwind/react";
import Avatar from "../../image/avatar.png";
import {
  faPenToSquare,
  faCirclePlay,
  faCircleStop,
  faCirclePause,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NFT from "../../image/nft.png";
import Ethereum from "../../image/ethereum.png";
import { setModalFiled } from "../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { useManageContract } from "../../hooks/useManageContract";
import { ModalEditMinting } from "../ModalEditMinting/index";
import ModalLoading from "../ModalLoading";
import { isEmpty } from 'lodash'
import { getImageBuild } from "../../utils";

const ContractTab = () => {
  const dispatch = useDispatch();
  const {
    handleSelectPhases,
    phasesList,
    phasesListSelected,
    smartContractAddress,
    name,
    projectDir,
    contractDetail,
    getSmartContractDetail,
    handleMinting,
    isShowModalMinting,
    handleCallbackModalMinting,
    typeModalMinting,
    handleGetAllPhase,
    handleWithdraw,
    handleCheckbox,
    isShowLoading,
    totalSupplyRedux,
    activeAirDrop,
    whiteListAddress,
    handleStatusActiveAirDrop
  } = useManageContract();


  const options = [
    {
      name: "Start",
      icon: faCirclePlay,
    },
    {
      name: "Pause",
      icon: faCirclePause,
    },
    {
      name: "End",
      icon: faCircleStop,
    },
  ];

  useEffect(() => {
    handleGetAllPhase();
    getSmartContractDetail();
  }, []);

  const { balanceOf = 0, totalSupply = 0, maxSupply = 0 } = contractDetail;
  const phaseActive = phasesList.find((item) => item?.status == 1 || item?.status == 2)

  const renderShowNFT = (amountMinted, maxSupply, ether, price, isShowPrice = true) => {
    return (
      <div
        className={`grid ${isShowPrice ? 'grid-cols-3' : 'grid-cols-2'} my-2 items-center`}
      >
        <div className="flex items-center">
          <img src={NFT} width={20} />
          <p className="pl-3">
            {amountMinted} / {maxSupply}
          </p>
        </div>
        {isShowPrice ?
          <div className="flex items-center">
            <p className="pl-3">
              Price: {price} ETH
            </p>
          </div> : null
        }
        <div className="flex items-center">
          {/* <img src={Ethereum} width={20} /> */}
          <p className="pl-3">Total: {ether} ETH</p>
        </div>
      </div>
    );
  };

  const imgCover = projectDir && getImageBuild(projectDir, '1')


  return (
    <Fragment>
      <div>
        <ModalEditMinting
          isShowModal={isShowModalMinting}
          handleCallback={handleCallbackModalMinting}
          data={{
            typeModalMinting: typeModalMinting || "Add",
            name: phasesListSelected?.name || 0,
            price: phasesListSelected?.price || 0,
            maxPublicSupply: phasesListSelected?.maxSupply || 0,
            maxTokensPerAddress: phasesListSelected?.maxPerWallet || 0,
            totalSupply: totalSupplyRedux || 0,
            whiteListAddress: whiteListAddress || "",
          }}
        />
        {/* head */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <img src={imgCover} width={150} className="rounded-lg" />
            <div className="pl-4 pt-3">
              <span className="font-semibold text-black">{name}</span>
              {/* <span className="text-gray ml-2 font-semibold">(xxxx)</span> */}

              <div className="flex flex-row w-full items-center mt-3">
                <img src={Avatar} width={20} height={20} />
                <p className="pl-2 text-gray">
                  {smartContractAddress.slice(0, 12) +
                    "..." +
                    smartContractAddress.slice(-3)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-3 h-fit">
            <Button
              variant="outlined"
              color={!activeAirDrop ? "gray" : "green"}
              className="capitalize flex flex-row items-center justify-center"
              onClick={() => {
                handleStatusActiveAirDrop()
              }}
            >
              Airdrop
            </Button>

            <Button variant="outlined" color="gray" className="capitalize" onClick={() => window.open(`/mint?${smartContractAddress}`, '_blank', 'noopener,noreferrer')}>
              Mint page
            </Button>
          </div>
        </div>

        {/* sale */}
        <div className="mt-6 mb-4 flex flex-row justify-between items-center">
          <p className="font-bold text-xl">Phases & Sale</p>


          <Button
            variant="outlined"
            color="gray"
            className="capitalize flex flex-row items-center justify-center gap-1"
            onClick={() => {
              handleMinting({ handleTypeModal: "Add" });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              width="20px"
              viewBox="0 0 24 24"
              fill="#6B7280"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M13 11h-2v3H8v2h3v3h2v-3h3v-2h-3zm1-9H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
            </svg>
            Add phase
          </Button>

        </div>
        {phasesList.map((item, index) => {
          const totalEther = item?.amountMinted * item?.price;
          const isPhasesEnd = item?.status == 3


          return (
            <div
              key={'phasesList-' + index}
              className={`${"border-slate-300 border-[1px]"
                } rounded-lg grid grid-cols-2 items-center w-full mb-3 p-4
                ${isPhasesEnd && 'bg-zinc-100 border-zinc-100 opacity-70'}
                `}
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  {/* <Checkbox
                    id={`${index}`}
                    name={item?.name}
                    onChange={() => handleCheckbox(index)}
                    checked={phasesSelected == index}
                    disabled={isPhasesEnd}
                  /> */}
                  <p className="font-semibold">{item?.name}</p>
                </div>

                {renderShowNFT(
                  item?.amountMinted,
                  item?.maxSupply,
                  totalEther,
                  item?.price,
                  true
                )}
              </div>

              <div className="w-full h-full flex justify-center items-center relative">
                {/* check phases not end and phaseNum not equal phaseActive */}
                {!isEmpty(phaseActive) && phaseActive?.phaseNum !== item.phaseNum && !isPhasesEnd ? null :
                  <div className="w-[250px]">
                    <Select
                      size="md"
                      label="Select Phases"
                      onChange={(e) => handleSelectPhases(item?.phaseNum, e, index, item?.status)}
                      value={item?.status > 0 ? options[item?.status - 1].name : ''}
                      disabled={isPhasesEnd}
                      className={`${isPhasesEnd && 'opacity-60 hover:cursor-default'}`}
                    >
                      {options.map((value, index) => (
                        <Option key={index} value={value?.name}>
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={value?.icon}
                              className="text-lg"
                            />
                            <p className="pl-2">{value?.name}</p>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </div>
                }

                <button
                  onClick={() => {
                    handleMinting({ handleTypeModal: "Edit", index: index });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="text-xl absolute top-0 right-0 hover:cursor-pointer"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* contract balance */}
      <div className="grid grid-cols-2 mt-10 gap-3">
        <div className="border-[1px] border-slate-300 p-4 rounded-lg">
          <p className="text-slate-400 font-semibold">Contract Balance</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={Ethereum} width={20} height={20} />
              <p className="pl-2 text-xl font-semibold">{balanceOf} ETH</p>
            </div>
            <Button disabled={balanceOf == 0} onClick={() => handleWithdraw()}>Withdraw</Button>
          </div>
        </div>

        <div className="border-[1px] border-slate-300 p-4 rounded-lg">
          <p className="text-slate-400 font-semibold">Totals</p>
          {renderShowNFT(totalSupply, maxSupply, balanceOf, null, false)}
        </div>
      </div>

      <ModalLoading isShowLoading={isShowLoading} />

    </Fragment>
  );
};

export default ContractTab;
