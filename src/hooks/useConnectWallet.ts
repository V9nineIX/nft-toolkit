import React, { useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// import { injectedConnector } from '../connectors/'
import { reactLocalStorage } from 'reactjs-localstorage'
import { useDispatch, useSelector } from 'react-redux'
import { useWalletModalToggle } from '../hooks/useApplication'


export const useConnectWallet = () => {
  const {
    chainId,
    account,
    activate,
    library,
    deactivate,
    active,
    connector
  } = useWeb3React<Web3Provider>()
 const  toggleWalletModal =   useWalletModalToggle()
  const dispatch = useDispatch()

  const connectWallet = () => {
    toggleWalletModal()
  }

  const disconnectWallet = () => {
    deactivate()
    reactLocalStorage.remove('isLogin')
    reactLocalStorage.remove('isWalletConnected')
  }

  const isSignIn = () => {
    const res = reactLocalStorage.get('accessToken')
    if (res) return true
    else return false
  }

  return {
    connectWallet,
    account,
    library,
    disconnectWallet,
    chainId,
    isSignIn,
    active,
    connector
  }
}
