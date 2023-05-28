import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

 import { useEagerConnect, useInactiveListener ,useActiveListener } from '../../hooks/useConnectNetwork'
 import { NetworkContextName ,injected } from '../../connectors'


export default function Web3ReactManager({ children }: { children: JSX.Element }) {
//   const { t } = useTranslation()
  const { active } = useWeb3React()
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()


  const triedEager = useEagerConnect()

  useEffect(() => {
    

    if (triedEager && !networkActive && !networkError) {
        // console.log("triedEager" ,triedEager)
        // console.log(networkActive)
        // console.log("active" , active)
       activateNetwork(injected)
    }
  }, [triedEager, networkActive, networkError, activateNetwork])


    // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
    useInactiveListener(!triedEager)
    useActiveListener(!triedEager)

     // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 600)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null
  }


  

//   // if neither context is active, spin
//   if (!active && !networkActive) {
//     return showLoader ? (
//       <MessageWrapper>
//         <Loader />
//       </MessageWrapper>
//     ) : null
//   }

  return children
}
