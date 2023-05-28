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


type Props = {
    isShowModal: boolean,
    handleOpen: any,
}


export const ModalContract = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
    } = props


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
                    Create a Contract
                    <span>Enter a name for your new contract.</span>
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <div className='mb-6'>
                            <Input
                                type='text'
                                color="gray"
                                label="Name"
                            />
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
                        <span>Create Contract</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment>
    )
}