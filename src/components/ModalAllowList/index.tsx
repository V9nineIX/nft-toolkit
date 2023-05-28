import React, { Fragment, useState } from 'react'
import '../../styles/modalAddLayer.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";


type Props = {
    isShowModal: boolean,
    handleOpen: any,
}


export const ModalAllowList = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
    } = props

    const [isUploadCSV, setIsUploadCSV] = useState<boolean>(true)

    const handleCloseModal = () => {
        handleOpen()
        // handleCloseModalAddLayer()
    };

    const handleConfirm = () => {
        handleOpen()
        // handleOpen(inputLayerName)
        // setInputLayerName('')
        // handleCloseModal()
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
                    Import Allowlist
                    <span>Please upload the CSV for your allowlist, or click "Insert Manually" to paste addresses. Each address should be on a new line.</span>
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <div className='mb-6'>
                            <Input
                                type="text"
                                color="gray"
                                label="Name"
                            />
                            <Typography
                                variant='small'
                            >
                                A human readable name to identify the allowlist. Only you will see this.
                            </Typography>
                        </div>
                        <div className='flex flex-col w-100'>
                            <div className='flex justify-between mb-4'>
                                <Typography
                                    variant='h6'
                                >
                                    Wallets
                                </Typography>
                                <Button
                                    variant="text"
                                    ripple={false}
                                    className="w-fit px-0 disabled:hover"
                                    onClick={() => setIsUploadCSV(!isUploadCSV)}
                                >
                                    <Typography
                                        variant='h6'
                                    >
                                        {
                                            isUploadCSV ?
                                                `Insert Manually`
                                                :
                                                `Upload CSV`
                                        }
                                    </Typography>
                                </Button>
                            </div>
                            {
                                isUploadCSV ?
                                    <input
                                        type="file"
                                        accept=".csv"
                                        placeholder="Choose File"
                                    />
                                    :
                                    <textarea
                                        className='textareaWalletAddresses '
                                        placeholder={"Wallet addresses (new line separated)"}
                                    >

                                    </textarea>
                            }
                            <div className='flex justify-end'>
                                <Button
                                    variant="text"
                                    className="w-fit px-0 disabled:hover"
                                    ripple={false}
                                    onClick={() => null}
                                >
                                    <Typography
                                        variant='small'
                                        className="text-right"
                                    >
                                        Download Sample File
                                    </Typography>
                                </Button>
                            </div>
                        </div>
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
                        // color={isNameExist || inputLayerName.length <= 0 ? "grey" : "blue"}
                        // disabled={isNameExist || inputLayerName.length <= 0}
                        onClick={handleConfirm}
                    >
                        <span>Upload</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}