import React, { Fragment, useState } from 'react'
import '../../styles/modalAddLayer.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    Select,
    Option,
} from "@material-tailwind/react";
import { SECRET_ACCESS_TOKEN } from '../../constants';
import AlertCard from '../AlertCard/index';

type Props = {
    isShowModal: boolean,
    handleOpen: any,
    isErrorUploadIPFS: boolean,
    isSuccessUploadIPFS: boolean,
}


export const ModalUploadIPFS = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
        isErrorUploadIPFS = false,
        isSuccessUploadIPFS = false,
    } = props

    const [secretAccessToken, setSecretAccessToken] = useState<string>(SECRET_ACCESS_TOKEN)
    const [typeStorage, setTypeStorage] = useState<string>("nftstorage") // "nftstorage" ||"pinata"

    const typeStorageList = [
        {
            value: 'nftstorage',
            text: 'NFT.storage',
        },
        {
            value: 'custom',
            text: 'Normal image server',
        },

        {
            value: 'pinata',
            text: 'Pinata',
        },
    ]

    const handleCloseModal = () => {
        handleOpen({ secretAccessToken: secretAccessToken, isCloseModal: false })
    };

    const handleConfirm = async () => {
        handleOpen({ secretAccessToken: secretAccessToken, typeStorage: typeStorage, isCloseModal: false })
    };

    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            handleConfirm()
        }
    };

    const handleCancel = () => {
        handleOpen({ secretAccessToken: '', isCloseModal: true })
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

                <AlertCard
                    message={isSuccessUploadIPFS ? "Upload to IPFS success" : isErrorUploadIPFS ? "Please upload your form again" : ''}
                    isShow={isSuccessUploadIPFS || isErrorUploadIPFS}
                    type={isSuccessUploadIPFS ? "success" : isErrorUploadIPFS ? "error" : ''}
                />

                <DialogHeader className="modal-text-title">
                     <h5  className='text-lg' > Upload to IPFS or normal sever</h5>
                    {/* <span>IPFS is a great way to distribute your NFT data and ensure that your artwork survives long after minting is over.</span> */}
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <div className='flex flex-col items-end gap-[2rem] mb-6 pt-2 min-h-[150px]'>

                            <div className='w-[50%]'>
                                <Select variant="outlined" label="Select a provider" className="bg-white" value={typeStorage} onChange={(e) => setTypeStorage(e)}>
                                    {typeStorageList.map((item, index) => {
                                        return (
                                            <Option value={item.value} key={'typeStorage' + index}>{item.text}</Option>
                                        )
                                    })
                                    }
                                </Select>
                            </div>
                            {typeStorage == 'pinata' && (
                                <Textarea
                                    size="lg"
                                    color={'gray'}
                                    variant="outlined"
                                    label="Secret access token"
                                    disabled={typeStorage !== 'pinata'}
                                    value={secretAccessToken}
                                    onChange={(e) => { setSecretAccessToken(e.target.value.trim()) }}
                                    onKeyPress={handleKeypress}
                                />
                            )}
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        className="mr-1"
                        disabled={isSuccessUploadIPFS || isErrorUploadIPFS}
                        onClick={handleCancel}
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        disabled={isSuccessUploadIPFS || isErrorUploadIPFS}
                        onClick={handleConfirm}
                    >
                        <span>Upload</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}