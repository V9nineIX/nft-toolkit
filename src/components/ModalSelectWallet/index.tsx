import React, { useEffect, useState } from "react";
import "./modalSelectWallet.scss";
import metaMask from "../../image/metaMask.png";
import walletConnect from "../../image/walletConnect.png";
import { connectors } from "../../connectors";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

interface ModalSelectWalletProps {
  isOpenModal: boolean;
  setIsOpenModal: Function;
}

const ModalSelectWallet = (props: ModalSelectWalletProps) => {
  const { isOpenModal, setIsOpenModal } = props;
  const { activate, active, account } = useWeb3React<Web3Provider>();

  const handleConnectWallet = async (item) => {
      await activate(item);
      
      localStorage.setItem('isConnected', 'true')
      setIsOpenModal(false);
    };

  const walletList = [
    // {
    //   name: 'Wallet Connect',
    //   image: walletConnect,
    //   activate: connectors.walletConnect,
    // },
    {
      name: "Metamask",
      image: metaMask,
      activate: connectors.injected,
    },
  ];

  if (!isOpenModal) {
    return null;
  }

  return (
    <div className="wrap-modal-select-wallet">
      <div className="cover-modal">
        <div className="w-full text-xl pb-4">
          <p className="text-left font-medium">Select a wallet</p>
        </div>
        {walletList.map((item, index) => (
          <div
            className="wallet-box"
            key={index}
            onClick={() => handleConnectWallet(item.activate)}
          >
            <img
              alt={"image" + item.name}
              src={item.image}
              className="wallet-image"
            />
            <span className="wallet-title" >{item.name}</span>
          </div>
        ))}
        <button className={"btn-close"} onClick={() => setIsOpenModal(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalSelectWallet;
