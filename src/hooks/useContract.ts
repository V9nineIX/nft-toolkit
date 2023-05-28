import React, { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { getContract } from '../utils'
import { useActiveWeb3React } from './useActiveWeb3React'
import NFTABI from "../abis/factory.json"
import ERC721_ABI from '../abis/erc721.json'
import ERC1155_ABI from '../abis/erc1155.json'

// returns null on errors
function useContract(address: string, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()


  return useMemo(() => {
    if (!address || !ABI || !library) return null

    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}


export function useFactoryContract(): Contract | null {
  const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS
  return useContract(FACTORY_ADDRESS, NFTABI, true)
}

export function useERC721Contract(ERC721_ADDRESS): Contract | null {
  return useContract(ERC721_ADDRESS, ERC721_ABI, true)
}

export function useNFTContract(tokenType , tokenAddress ): Contract | null {
    
    let abi =  ERC721_ABI
    if(tokenType == "ERC1155"){
        abi = ERC1155_ABI
    }

    return useContract( tokenAddress , abi, true)
    
}
