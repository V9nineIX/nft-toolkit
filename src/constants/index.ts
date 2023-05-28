import { AbstractConnector } from '@web3-react/abstract-connector'

export const NFT_Address = "0xF6BFf28CCfA0f678A373B05B96DcB7F46B65dCA5"
export const NFT_CAT_Address = "0x2836a49849859264f0de774AD3f7D8D6b01a50B0"
// export const GRAPH_NFT_CAT = "https://api.thegraph.com/subgraphs/id/QmRWxzsFZGV5dHdZDCarQ6S51gsBGhNViprRKw53NXR34e"
export const GRAPH_NFT_CAT = "https://api.thegraph.com/subgraphs/name/v9nineix/cat"
export const VERSION = 1
export const NetworkContextName = 'NETWORK'
export const OPENSEA_DETAIL = "https://testnets.opensea.io/assets/rinkeby/0x2836a49849859264f0de774ad3f7d8d6b01a50b0"
export const ACCEPT_CHAIN_ID = 4
export const LIMIT_LOAD_INITIAL = 15
export const LIMIT_LOAD_MORE = 5
export const SECRET_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwN2E2ZWFlZi1mYzU1LTQwNTUtYjY5ZS1iMmViOGNiZTBiZGYiLCJlbWFpbCI6IndpbmFpcnVAcGxheXdvcmsuY28udGgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMjdlNmQ1OTA3ZTU0Y2IwMjNkNmMiLCJzY29wZWRLZXlTZWNyZXQiOiJmZDBmYjA4MDkxN2Q4NGIxODU4OWRkOTQ0ZGM0YWViMjM0OGM0ZWY4OGY3ZmVlYTM1N2M2ODIyNzc5MmY0NTA1IiwiaWF0IjoxNjY4NTgyNzAyfQ.jGS0VlvKpwjfA6gFlE18o9Ho7SJ5zcV3hpVX6YNv5l4"
export const RARE_COUNT = 5

export const CONTRACT_MERKLE_ROOT_TOKEN = '0x6173647361647361647361647361646173647361640000000000000000000000'
export const DURATION_DISPLAY_ALERT = 3000

export const DEFAULT_MERKLE_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000"


export declare enum ChainId {
  MAINNET = 56,
  BSCTESTNET = 97,
  TESTNET = 4

}
export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}



export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {

  // METAMASK: {
  //   connector:  connectors.injected,
  //   name: 'MetaMask',
  //   image: '/mm.png',
  //   activate: connectors.injected,
  //   description: 'Easy-to-use browser extension.',
  //   href: null,
  //   color: '#E8831D'
  // },
  // WALLET_CONNECT: {
  //   connector: connectors.walletConnect,
  //   name: 'Wallet Connect',
  //   image: '/wc.png',
  //   activate: connectors.walletConnect,
  //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
  //   href: null,
  //   color: '#4196FC',
  //   mobile: true
  // },
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}