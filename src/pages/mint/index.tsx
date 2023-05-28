import React, { useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMint } from "../../hooks/useMint";
import EmptyPage from "../../components/EmptyPage";
import ModalLoading from "../../components/ModalLoading";
import AlertCard from "../../components/AlertCard";
import { HeaderMint } from "../../components/HeaderMint/index";
import { getImageBuild } from "../../utils";
import { isEmpty } from 'lodash'
import { ModalToken } from '../../components/ModalToken/index';
import ModalSelectWallet from '../../components/ModalSelectWallet'

const Mint = () => {
  const {
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
  } = useMint();

  useEffect(() => {
    if (contract) {
      handleGetActivePhase();
      handleGetMintAvailable();
    }
  }, [contract]);


  if (isEmpty(account)) {
    return (
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Button onClick={() => setIsShowModalSelectWallet(true)}>Connect wallet</Button>
        <ModalSelectWallet
          isOpenModal={isShowModalSelectWallet}
          setIsOpenModal={setIsShowModalSelectWallet}
        />
      </div>
    )
  } else if (isEmpty(phasesActive)) {
    if (isDataSmartContractNotFound) {
      return <EmptyPage textStatus="Smart contract address not found" style={{ height: "calc(100vh)" }} />
    }

    return null
  }

  const { maxPerWallet, maxSupply, name, price = 0, status } = phasesActive;

  const countDecimal = price?.toString().split(".")[1];
  const totalPrice = Number(price * mintAmount).toFixed(countDecimal?.length);

  return (
    <div className='w-full h-[100vh] bg-blue-gray-200'>
      <HeaderMint
        data={{
          collection: collection,
          bgCover: null,
          imgCollection: getImageBuild(collection?.projectDir, '1'),
        }}
      />
      {status == 0 ? (
        <div className="w-full h-[70vh] flex justify-center items-center">
          <EmptyPage textStatus="No phases is available." />
        </div>
      ) : status == 3 ? (
        <div className="w-full h-[70vh] flex justify-center items-center">
          <EmptyPage textStatus="This phases are sold out." />
        </div>
      ) : (
        !isEmpty(phasesActive) &&
        <div className="w-full h-[70vh] flex flex-col justify-center items-center">
          <div className="w-[450px] p-6 rounded-[20px] drop-shadow-md bg-white">
            <div className="flex justify-between p-3 mb-4 rounded-xl border-[1px] border-slate-300 text-blue-600 bg-slate-100 font-semibold">
              <div className="flex items-center text-blue-600">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="pr-3"
                />
                <p>Max {maxPerWallet} per wallet</p>
              </div>
              <p className="text-gray-400">
                <span className="text-black">{availableMint} </span>/{" "}
                <span>{maxPerWallet}</span>
              </p>
            </div>

            <div className="flex flex-col p-4 my-4 rounded-xl border-[1px] border-slate-300">
              <div className="flex justify-between">
                <p className="font-bold">{name}</p>
                <p className="font-bold">{price} ETH</p>
              </div>
              <div className="pt-2">
                <p className="text-gray-400 font-medium">
                  Available:
                  <span className="text-black font-bold">
                    {" "}
                    {totalSupply}{" "}
                  </span>{" "}
                  /<span className="text-black font-light"> {maxSupply}</span>
                </p>

                <div className="flex justify-between items-center w-full mt-5 bg-white border-[1px] rounded-lg border-slate-300">
                  <button
                    className="bg-white text-black text-3xl py-1 px-4 drop-shadow-none rounded-lg disabled:text-gray-300"
                    onClick={() => handleDecrementMintAmount()}
                    disabled={mintAmount == 1}
                  >
                    -
                  </button>
                  <div className="hover:cursor-default">{mintAmount}</div>
                  <button
                    className="bg-white text-black text-2xl py-1 px-4 drop-shadow-none rounded-lg disabled:text-gray-300"
                    onClick={() => handleIncrementMintAmount()}
                    disabled={availableMint == 0 || mintAmount == availableMint || maxSupply - totalSupply == mintAmount}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full capitalize text-base"
              onClick={() => handleClickMint()}
              disabled={status == 2 || availableMint == 0}
            >
              {status == 2
                ? "Pause"
                : availableMint == 0
                  ? `Exceed ${maxPerWallet} times per wallet`
                  : `Mint ${mintAmount} for ${totalPrice} ETH`}
            </Button>
          </div>

          <ModalToken
            isShowModal={isShowModalTokenList}
            tokenList={tokenList}
            handleCallback={() => handleCloseModalTokenList()} //call back close modal
          />

          <ModalLoading isShowLoading={isShowLoading} />
          <AlertCard
            isShow={alertMessage?.isShow}
            message={alertMessage?.message}
            type={alertMessage?.type}
          />

        </div>
      )}
    </div>
  );
};

export default Mint;
