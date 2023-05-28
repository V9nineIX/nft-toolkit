import { reverse, isEmpty } from 'lodash';
import { formatEther } from "@ethersproject/units";
import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { ChainId } from '../constants'
import { reactLocalStorage } from 'reactjs-localstorage';
import mergeImages from "merge-images";
import { useLocation } from 'react-router-dom';
import IconEmpty from '../../src/image/imageEmpty.svg';


export const displayCurrency = (value: any, decimal: number = 5) => {
  return parseFloat(formatEther(value)).toFixed(decimal)
}

export const displayCurrencyForInput = (value: any) => {
  return formatEther(value)
}

export const transformToEther = (value: any) => {
  return Number(formatEther(value))
}

export const displayEtherDecimal = (value: any, decimal: number = 2) => {
  return displayDecimal(formatEther(value), decimal)
}

export const displayDecimal = (value: any, decimal: number = 2) => {
  const cal: number = 10 ** decimal
  const output: number = Math.floor(parseFloat(value) * cal) / cal
  return output

}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}



// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}


// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}


export function isCorrectNetwork(chainId: number) {
  return (chainId == parseInt("4", 10))
}


// const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
//   56: '',
//   4: 'testnet.'
// }

// export function getEtherscanLink(chainId: ChainId , data: string, type: 'transaction' | 'token' | 'address'): string {
//   const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[56]}bscscan.com`

//   switch (type) {
//     case 'transaction': {
//       return `${prefix}/tx/${data}`
//     }
//     case 'token': {
//       return `${prefix}/token/${data}`
//     }
//     case 'address':
//     default: {
//       return `${prefix}/address/${data}`
//     }
//   }
// }



// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function clearSessionWalletConnect(): void {
  try {
    reactLocalStorage.remove('walletconnect')
    reactLocalStorage.remove('WALLETCONNECT_DEEPLINK_CHOICE')
    reactLocalStorage.remove('isloginWalletConnect');
  } catch (ex) {

  }

}



export const mergeTrait = (imageList: any) => {
  let result = null
  try {
    // crossOrigin: "Anonymous" is protect CORS
    result = mergeImages(reverse([...imageList]), { crossOrigin: "Anonymous", quality: 0.50, format: 'image/webp' }).then((base64) => {
      if (base64 == 'data:,') {
        return null
      } else {
        return base64
      }
    })
  } catch (err) {
    console.log('err merge image');
  }

  return result
}


export const checkUploadImageLayer = (data) => {
  if (data.some((item) => item?.images?.length > 0)) {
    return true
  } else {
    return false
  }
}


export const getIdCollectionFromSearch = () => {
  const location = useLocation();
  const { search } = location
  const _id = search.replace('?id=', '')

  return _id

}

export const getImageBuild = (projectDir, tokenId) => {
  if (!isEmpty(projectDir) && !isEmpty(tokenId)) {
    const api = import.meta.env.VITE_PUBLIC_API_BASE_URL;
    const imgCover = `${api + "/folder/" + projectDir + `/build/image/${tokenId}.png`}`;

    return imgCover
  }

  return IconEmpty
}

export const formatDecimalEther = (num1, num2) => {

    const Num1 = num1
    const Num2 = num2
    const cf = 1000000000
    return (Num1 * cf) * (Num2 * cf) / (cf * cf)

}