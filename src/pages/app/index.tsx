import Header from '../../components/TopHeader'
import SideLeftMenu from '../../components/SideLeft'
import '../../styles/app.scss'
import '../../styles/base.scss'
import NavMenu from '../../components/NavMenu'

import { LayerWidget } from '../../components/LayerWidget'
import { useGenerateSocket } from '../../hooks/useGenerateSocket'
import { Progress } from '@material-tailwind/react'
import AlertCard from '../../components/AlertCard'
import { useApp } from './useApp'
import SideRight from '../../components/SideRight'
import { useSideRight } from '../../hooks/useSideRight'
import { useEffect, useState } from 'react'


const App = () => {
  const {
    statusSocket,
    progressSocket,
    isShowProgress,
    alertType,
    messageAlertSocket,
    isShowMessageAlert,
  } = useGenerateSocket({})

  const {
    collectionSelectList,
    previewDetailList,
  } = useSideRight({})

  const useAppHook = useApp({})

  const [navMenuTab, setMenuTab] = useState<string>('Design')

  return (
    <div className='relative'>

      <AlertCard
        message={messageAlertSocket}
        isShow={isShowMessageAlert}
        type={alertType}
      />

      {isShowProgress && (
        <>
          <Progress
            className='fixed top-0 left-0 right-0 z-[2000]'
            variant='gradient'
            value={progressSocket || 0}
            label={statusSocket || null}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              justifyContent: progressSocket == 10 && 'flex-start',
            }}
            color="green"
          />
        </>
      )}

      <Header />

      <div className="wrap-content">
        {(navMenuTab !== "Preview" && navMenuTab !== "Custom token") && (<SideLeftMenu />)}


        <LayerWidget navMenuTab={navMenuTab} pageName="App" />


        <div className="content">
          <NavMenu
            pageName="App"
            dataGenerate={{
              isShowProgress: isShowProgress,
            }}
            navMenuActiveTab={(e) => { setMenuTab(e) }}
          />
        </div>


        {(navMenuTab == "Preview") && (<SideRight />)}



      </div>

    </div>
  )
}

export default App
