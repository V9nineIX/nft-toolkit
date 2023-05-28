import React, { Fragment, useState } from 'react'
import '../../styles/modalAddLayer.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { Collection } from '../../api/collection';
import { v4 as uuidv4 } from 'uuid';
import { getLocalstorage, getWithExpiry, setWithExpiry } from '../../utils/localstoageHelper';
import { useCollectionList } from '../../hooks/useCollectionList';
import { useDispatch, useSelector } from 'react-redux';
import { setAppFiled } from '../../redux/slices/applicationSlice';

type Props = {
    isShowModal: boolean,
    handleOpen: any,
}

type IParamCreateCollection = {
    name: string,
    ownerId: string,
}


export const ModalAddCollection = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
    } = props

    const dispatch = useDispatch()
    const [collectionName, setCollectionName] = useState('');
    const [totalSupply, setTotalSupply] = useState(0);

    const {
        ownerId,
        isCreateCollection,
        setIsCreateCollection,
    } = useCollectionList({})



    const handleCloseModal = () => {
        handleOpen()
        // handleCloseModalAddLayer()
    };

    const handleConfirm = async () => {
        try {
            // let localStorageOwnerId = getLocalstorage("ownerId")
            const localStorageOwnerId = ownerId
            let resOwnerId = ''

            if (localStorageOwnerId) {
                resOwnerId = localStorageOwnerId
            } else {
                const ownerIdGen = uuidv4();
                resOwnerId = ownerIdGen

                //Expiry 30Day 
                // ==> 10min = 600,000 ms
                // 1min = 60,000ms 
                // 60min = 1hr = (60,000ms) 3,600,000ms
                // 24hr = 1day = (3,600,000ms) 86,400,000ms
                // 30day = 1mouth = (86,400,000ms) 2,592,000,000ms
                // setWithExpiry("ownerId", ownerIdGen, 2592000000)
                dispatch(
                    setAppFiled({
                        key: "ownerId",
                        value: resOwnerId
                    })
                )
            }

            const paramCreateCollection: IParamCreateCollection = {
                name: collectionName,
                ownerId: resOwnerId
            }
            const resData = await Collection.createCollection(paramCreateCollection)
            // console.log('resData', resData.data)
            setIsCreateCollection(true)

        } catch (error) {
            console.log('error', error)
        }
        handleOpen()
        // handleOpen(inputLayerName)
        // setInputLayerName('')
        // handleCloseModal()
    };

    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            handleConfirm()
        }
    };

    const handleCancel = () => {
        handleOpen()
        // handleOpen('')
        // setInputLayerName('')
        // handleCloseModal()
    };

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleOpen}
                dismiss={{ enabled: false }}
                size={'md'}
            >
                <DialogHeader className="modal-text-title">
                    Create a Collection
                    <span>Enter a name for your new collection.</span>
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <div className='mb-6 pt-2'>
                            <Input
                                type={'text'}
                                color={'gray'}
                                variant="static"
                                label="My new collection"
                                onChange={(e) => { setCollectionName(e.target.value.trim()) }}
                                onKeyPress={handleKeypress}
                            />
                        </div>
                        {/* <div className='mb-6'>
                            <Input
                                type={'number'}
                                color="grey"
                                label="Total supply"
                                onChange={(e) => { setTotalSupply(Number(e.target.value.trim())) }}
                            />
                        </div> */}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        className="mr-1"
                        onClick={handleCancel}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"

                        color={((collectionName.length <= 0) && (!totalSupply && totalSupply === 0)) ? "gray" : "blue"}
                        disabled={(collectionName.length <= 0) && (!totalSupply && totalSupply === 0)}
                        onClick={handleConfirm}
                    >
                        <span>Create Collection</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}