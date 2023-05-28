import React, { useEffect, useState } from 'react'
import './navMenu.scss'
import Setting from '../Setting'
import Rarity from '../Rarity'
import { Button } from '@material-tailwind/react'
import { useCollection } from '../../hooks/useCollection'
import Preview from '../Preview'
import Gallery from '../Gallery'
import { useDispatch } from 'react-redux'
import { removeTabPreview, setCollectionFiled } from '../../redux/slices/collectionSlice'
import { Collection } from '../../api/collection';
import { isEmpty, filter } from "lodash"
import { ExportTab } from '../Export'
import { useUploadIPFS } from '../../hooks/useUploadIPFS'
import CustomToken from '../CustomToken/index'
import { setModalFiled } from '../../redux/slices/modalSlice'
import Loading from '../Loading/index';
import { ModalUploadIPFS } from '../ModalUploadIPFS/index';
import { checkUploadImageLayer } from '../../utils'
import Launch from '../Launch/index';
import { setExportFiled } from '../../redux/slices/exportSlice'
import AlertCard from '../AlertCard'


const NavMenu = ({ pageName = "App", dataGenerate, navMenuActiveTab, navList = ['Design', 'Rarity', 'Setting', 'Preview', 'Custom token'] }: any) => {


  // custom hook
  const {
    handleGenerate,
    layers,
    handleSaveData,
    handleGenerateCollection,
    handleGenerateCollectionCustom,
    elementList,
    collection,
    customTokenAll,
    isGoLaunch,
    isShowModalLoading,
    alertMessage,
    isShowAlert,
    alertType
  } = useCollection({})

  const {
    isShowModalUploadIPFS, setIsShowModalUploadIPFS,
    secretAccessToken, setSecretAccessToken,
    handleUploadIPFS,
    isShowModalUploadIPFSLoading,
    isErrorUploadIPFS,
    isSuccessUploadIPFS,
  } = useUploadIPFS({})



  const dispatch = useDispatch()
  const [isActive, setIsActive] = useState<number>(0)
  const items = 1 !== 1 && collection.status == 'completed' ? filter(navList, (e) => e !== 'Preview') : navList


  const {
    isShowProgress,
  } = dataGenerate

  const isNotValid = layers.filter((item) => !item.isValid).length > 0

  useEffect(() => {
    if (isGoLaunch) {
      setIsActive(2)
      dispatch(setExportFiled({
        key: 'isGoLaunch',
        value: false
      }))
    }
  }, [isGoLaunch])

  const onClickTab = (activeIndex) => {
    // set button update total supply is can update
    if (items[activeIndex] == 'Preview' || items[activeIndex] == 'Export') {
      dispatch(setCollectionFiled({
        key: 'isCanUpdateTotalSupply',
        value: true
      }))
    } else {
      dispatch(setCollectionFiled({
        key: 'isCanUpdateTotalSupply',
        value: false
      }))

      dispatch(removeTabPreview())
    }
    setIsActive(activeIndex)
    navMenuActiveTab(items[activeIndex])

  }


  const RenderContent = ({ isActive }) => {
    let component = <></>

    switch (items[isActive]) {
      case 'Design':
        component = <Preview />
        break
      case 'Rarity':
        component = <Rarity />
        break
      case 'Setting':
        component = <Setting pageName={pageName} />
        break
      case 'Preview':
        component = <Gallery />
        break
      case 'Export':
        component =
          <ExportTab />
        break
      case 'Custom token':
        component = <CustomToken />
        break
      case 'Launchpad':
        component = <Launch />
        break
      default:
    }

    return component
  }


  const handleOpenModalSmartContract = () => {
    if (!isEmpty(collection?.smartContractAddress)) {
      dispatch(setModalFiled({
        key: 'isShowModalReCreate',
        value: true
      }))
    } else {
      dispatch(setModalFiled({
        key: 'isOpenModal',
        value: true
      }))
    }
  }





  return (
    <div className="wrap-nav-menu">


      <div className='cover-nav'>
        <div className="nav-menu-list">
          {items.map((item, index) => (
            <span
              key={index}
              className={`${isActive == index ? 'menu-active' : ''}`}
              onClick={() => onClickTab(index)}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="nav-box-button">
          {pageName == "Export" ?
            <>
              {items[isActive] !== 'Launchpad' ?
                <>
                  {/* <Button variant="outlined" className='btn-generate' onClick={() => {
                window.location.href = window.location.href.replace('export', 'app')
              }}
              >
                Edit
              </Button> */}
                  {items[isActive] == 'Export' ?
                    <Button
                      className='mr-2 drop-shadow-none'
                      variant="outlined"
                      onClick={handleOpenModalSmartContract}
                    >
                      <span>{!isEmpty(collection?.smartContractAddress) ? 'Re create smart contract' : 'Create smart contract'}</span>
                    </Button>
                    :
                    <Button variant="outlined" className='btn-generate px-4' onClick={() => handleSaveData()}>
                      Save
                    </Button>
                  }
                  <Button
                    variant="outlined"
                    color="red"
                    className='btn-generate'
                    onClick={setIsShowModalUploadIPFS}
                  >
                    Upload
                  </Button>
                </>
                :
                <>
                </>
              }
            </>
            :
            <>
              {
                collection?.status == "completed" ?
                  <>
                    <Button variant="outlined" className='btn-generate whitespace-nowrap px-4' onClick={() => {
                      window.location.href = window.location.href.replace('app', 'export')
                    }}>
                      Export
                    </Button>
                  </>
                  :
                  null
              }

              <>
                {
                  items[isActive] == 'Custom token' && collection?.status != "completed" && (
                    <Button
                      variant="outlined"
                      color="red"
                      className='btn-generate whitespace-nowrap flex flex-row justify-center items-center '
                      disabled={
                        isShowProgress
                        || isEmpty(customTokenAll?.meta)
                        || !checkUploadImageLayer(collection?.layers) && isEmpty(customTokenAll?.meta)
                      }
                      onClick={(event) => {
                        handleGenerateCollectionCustom(event)
                      }}>
                      {isShowProgress && (
                        <div className="flex flex-row justify-center items-center mr-2">
                          <span className="loader ease-linear rounded-full border-4 border-t-4 border-t-red h-6 w-6" />
                        </div>
                      )}
                      Export
                    </Button>
                  )}

              </>


              <Button variant="outlined" className='btn-generate px-4' onClick={() => handleSaveData()}>
                Save
              </Button>

            </>
          }
          {/* <Button variant="outlined" color="red" className='btn-generate' disabled={isNotValid} onClick={() => handleGenerateCollection()}>
            Generate Collection
          </Button> */}
          {isEmpty(elementList) ? null
            : items[isActive] !== 'Preview' || collection?.status == "completed" ? null
              :
              <>
                <Button
                  variant="outlined"
                  color="red"
                  className={'btn-generate flex flex-row justify-center items-center px-4 ' + (isShowProgress ? 'cursor-default  hover:cursor-default' : '')}
                  disabled={isShowProgress || collection.status == 'completed'}
                  onClick={(e) => handleGenerateCollection(e)}
                >
                  {isShowProgress && (
                    <div className="flex flex-row justify-center items-center mr-2">
                      <span className="loader ease-linear rounded-full border-4 border-t-4 border-t-red h-6 w-6" />
                    </div>
                  )}
                  Generate
                </Button>
              </>
          }


        </div>

      </div>

      <div className="nav-menu-content">
        <div className="overflow-y-auto  h-[calc(100vh-(60px+61px))]">
          {RenderContent({ isActive: isActive })}
        </div>
      </div>

      {isShowModalUploadIPFSLoading || isShowModalLoading ?
        <div className='bg-black/[0.2] absolute top-[0] left-[0] w-[100%] h-[100%] z-[19999] flex items-center justify-center'>
          <div className='bg-bgPage p-[30px] rounded-card shadow-card'>
            <Loading />
          </div>
        </div>
        : null
      }

      <ModalUploadIPFS
        isShowModal={isShowModalUploadIPFS}
        handleOpen={handleUploadIPFS}
        isErrorUploadIPFS={isErrorUploadIPFS}
        isSuccessUploadIPFS={isSuccessUploadIPFS}
      />

      <AlertCard
        message={alertMessage}
        isShow={isShowAlert}
        type={alertType}
      />
    </div>
  )
}

export default NavMenu
