import React, { Fragment, useEffect } from 'react'
import NavMenu from '../../components/NavMenu'
import Header from '../../components/TopHeader'
import { useExport } from './useExport'
import { useSideRight } from '../../hooks/useSideRight'
import { useGenerateSocket } from '../../hooks/useGenerateSocket'
import AlertCard from '../../components/AlertCard'
import { Progress } from '@material-tailwind/react'
import { LayerWidget } from '../../components/LayerWidget'
import { isEmpty } from 'lodash';
import ModalLoading from '../../components/ModalLoading'
import { useDispatch } from 'react-redux'
import { setModalFiled } from '../../redux/slices/modalSlice'
import { ModalUpdateMaxSupplySmartContact } from '../../components/ModalUpdateMaxSupplySmartContact'
import { setAlertDetail } from '../../redux/slices/alertCardSlice'
import { Collection } from '../../api/collection';
import { setCollection } from '../../redux/slices/collectionSlice'


type Props = {}

export const Export = (props: Props) => {
    const dispatch = useDispatch()

    const {
        navMenuTab,
        setMenuTab,
        collection,
        isLoadingExport,
        isShowModalUpdateMaxSupplySmartContact,
        contract,
        collectionId,
    } = useExport({})

    const {
        statusSocket,
        progressSocket,
        isShowProgress,
        alertType,
        messageAlertSocket,
        isShowMessageAlert,
    } = useGenerateSocket({ pageName: 'export' })

    const {
        collectionSelectList,
        previewDetailList,
    } = useSideRight({})

    let resNavList = ["Export", "Setting", "Custom token"]
    if (!isEmpty(collection?.smartContractAddress)) {
        resNavList.push("Launchpad")
    }


    if (collection?.status !== "completed") {
        return null
    }

    const handleCallbackUpdateMaxSupplySmartContact = async (e) => {
        if (e?.btnType == 'confirm') {
            try {
                dispatch(setModalFiled({ key: 'isShowModalLoading', value: true }))
                //TODO update max supply smart contact
                const res = await contract.updateMaxSupply(Number(collection?.totalImage), collection?.ipfsJsonHash)
                await res.wait();
                const result = await Collection.updateCollectionById({ collectionId, data: { "isHasUpdate": false } })
                dispatch(setModalFiled({ key: 'isShowModalUpdateMaxSupplySmartContact', value: false }))
                dispatch(setCollection({ key: 'isHasUpdate', value: false }))
                setTimeout(() => {
                    dispatch(
                        setAlertDetail({
                            alertKey: 'UPDATE_MAX_SUPPLY_SMART_CONTACT_SUCCESS'
                        })
                    )
                }, 1000);
            } catch (error) {
                console.log(`error`, error);
                dispatch(
                    setAlertDetail({
                        alertKey: 'UPDATE_MAX_SUPPLY_SMART_CONTACT_ERROR'
                    })
                )
            }
            dispatch(setModalFiled({ key: 'isShowModalLoading', value: false }))
        } else if (e?.btnType == 'cancel') {
            dispatch(setModalFiled({ key: 'isShowModalUpdateMaxSupplySmartContact', value: false }))
        }

    };

    return (
        <Fragment>
            <div className='containerExport'>

                <AlertCard
                    message={messageAlertSocket}
                    isShow={isShowMessageAlert}
                    type={alertType}
                />

                {isShowProgress && (
                    <Progress
                        className='fixed top-0 left-0 right-0 z-10'
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
                )}


                <Header />
                <div className="wrap-content relative">

                    {collection?.isHasUpdate && (
                        <div className='h-[65px] px-6 bg-red-200 text-red-700 border-red-700 border-[1px] flex justify-center items-center absolute bottom-3 left-3 z-30 rounded-md'>
                            <span
                                className='pr-2'> Max supply has reduce need to update smart contract
                            </span>
                            <u
                                className='hover:cursor-pointer'
                                onClick={() => dispatch(setModalFiled({ key: 'isShowModalUpdateMaxSupplySmartContact', value: true }))}
                            >update</u>.
                        </div>
                    )}

                    <LayerWidget navMenuTab={navMenuTab} pageName="Export" />

                    <div className="content">
                        <NavMenu
                            pageName="Export"
                            dataGenerate={{
                                isShowProgress: false,
                            }}
                            navMenuActiveTab={(e) => { setMenuTab(e) }}
                            navList={resNavList}
                        />
                    </div>
                </div>
            </div>

            <ModalLoading isShowLoading={isLoadingExport} />

            <ModalUpdateMaxSupplySmartContact
                isShowModal={isShowModalUpdateMaxSupplySmartContact}
                handleCallbackUpdateMaxSupplySmartContact={handleCallbackUpdateMaxSupplySmartContact}
            />
        </Fragment>
    )
} 