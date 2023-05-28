
// eslint-disable-next-line import/no-unresolved
import { useWeb3React as useWeb3ReactCore  ,useWeb3React  } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { injected  ,walletconnect  } from '../connectors'
import {reactLocalStorage} from 'reactjs-localstorage';
// import { useDispatch } from 'react-redux'
// import { useConnectWallet } from './useConnectNetwork'
import { isCorrectNetwork  , clearSessionWalletConnect} from '../utils'
import {formatEther} from "@ethersproject/units";
import { VERSION } from "../constants"
import  {getWithExpiry  } from '../utils/localstoageHelper'



 const NetworkContextName  = "NETWORK"


export interface Web3ReactManagerFunctions {
    activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>;
    setError: (error: Error) => void;
    deactivate: () => void;
}
export interface Web3ReactManagerReturn extends Web3ReactManagerFunctions {
    connector?: AbstractConnector;
    provider?: any;
    chainId?: number;
    account?: null | string;
    error?: Error;
}
export interface Web3ReactContextInterface<T = any> extends Web3ReactManagerFunctions {
    connector?: AbstractConnector;
    library?: T;
    chainId?: number;
    account?: null | string;
    active: boolean;
    error?: Error;
}




// export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider>
//  & { chainId?: ChainId } {
//      const context = useWeb3ReactCore<Web3Provider>()
//     const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
//     return context.active ? context : contextNetwork
//   }
  
  export function useEagerConnect() {
    const { activate, active } = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does
    const [tried, setTried] = useState(false)
  
    useEffect(() => {
       const version = reactLocalStorage.get('version') || null
    //    const isloginWalletConnect  = getWithExpiry("isloginWalletConnect")  || false
        const isloginWalletConnect =   false
    //   if(  process.env.NODE_ENV == "production" ) {
    //     if( (!version ||  VERSION != version || !isloginWalletConnect) && isMobile ) {    
    //         reactLocalStorage.set('version' , VERSION)
    //         try {
    //             clearSessionWalletConnect()
    //             reactLocalStorage.remove('isLogin')
    //         }catch(ex){

    //         }
    //     }else{
            
    //     }
    // }




      injected.isAuthorized().then((isAuthorized) => {
       // const hasSignedIn = window.localStorage.getItem('accountStatus')
       // const isUserLogin  = reactLocalStorage.get('isLogin') || false
        const isUserLogin  = reactLocalStorage.get('isLogin') || false
        const  walletconnectStore = reactLocalStorage.get('walletconnect') || null
      
  
        if (isAuthorized  && isUserLogin == "true") {

          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else if (isMobile && isloginWalletConnect && isUserLogin == "true"  && walletconnectStore) { // case mobile connect
          activate( walletconnect , undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      })
    }, [activate]) // intentionally only running on mount (make sure it's only mounted once :))
  
    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
      if (active) {
        setTried(true)
      }
    }, [active])
  
    return tried
  }
  
  /**
   * Use for network and injected - logs user in
   * and out after checking what network theyre on
   */
  export function useInactiveListener(suppress = false) {
    const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does
  
    useEffect(() => {
      const { ethereum } = window
  
      if (ethereum && ethereum.on && !active && !error && !suppress) {
        const handleChainChanged = () => {
          // eat errors
           
          activate(injected, undefined, true).catch((e) => {
            console.error('Failed to activate after chain changed', e)
          })

          //TODO : something
        }
  
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length > 0) {
            // eat errors
            activate(injected, undefined, true).catch((e) => {
              console.error('Failed to activate after accounts changed', e)
            })
          }
        }

        const handleClose = () => {
            console.log("close")
        }
  
        ethereum.on('chainChanged', handleChainChanged)
        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('close', handleAccountsChanged)
        ethereum.on('disconnect', () => console.log("disconnect"))
  
        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('chainChanged', handleChainChanged)
            ethereum.removeListener('accountsChanged', handleAccountsChanged)
          }
        }
      }
      return undefined
    }, [active, error, suppress, activate])
  }
  

  export function useActiveListener(suppress = false) {
    const {account ,active, error, activate ,chainId } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

   

    useEffect(() => {
      const { ethereum } = window
  
      if (ethereum && ethereum.on && active && !error && !suppress) {
      
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length > 0) {
   
                // if (isCorrectNetwork(chainId)) {
                
                // }
              
          }
        }

        const handleChainChanged = () => {
          
  
          // if(isCorrectNetwork(parseInt(chainId))) {
   
          // }

        }

        ethereum.on('accountsChanged', handleAccountsChanged)
        ethereum.on('chainChanged', handleChainChanged)

        return () => {
          if (ethereum.removeListener) {
            ethereum.removeListener('chainChanged', handleChainChanged)
            ethereum.removeListener('accountsChanged', handleAccountsChanged)
          }
        }
      }
      return undefined
    }, [active, error, suppress, activate])
  }