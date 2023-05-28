import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";


// Metamask
export  const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});


// Wallet Connect
export const walletconnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${""}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});


// Coinbase Wallet
export const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${""}`,
  appName: "web3-react"
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};


export const NetworkContextName  = "NETWORK"
