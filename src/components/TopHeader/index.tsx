import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import "./header.scss";
import ModalSelectWallet from "../ModalSelectWallet";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

const Header = () => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { deactivate } = useWeb3React<Web3Provider>();
  const connected = localStorage.getItem("isConnected");

  useEffect(() => {
    if (connected === "true") {
      setIsConnected(true);
    }
  }, [connected]);

  const handleDisconnectWallet = () => {
    deactivate();
    localStorage.removeItem("isConnected");
    setIsConnected(false);
  };

  return (
    <div className="wrap-header">
      <div>
        <button className="hover:cursor-default">{"NFT Toolkit"}</button>
        <a
          href="/dashboard"
          className="pl-[40px] text-sm hover:underline"
        >
          Dashboard
        </a>
      </div>

      {isConnected ? (
        <Button color="blue" onClick={() => handleDisconnectWallet()}>
          Disconnect wallet
        </Button>
      ) : (
        <Button color="blue" onClick={() => setIsOpenModal(true)}>
          Connect wallet
        </Button>
      )}

      <ModalSelectWallet
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default Header;
