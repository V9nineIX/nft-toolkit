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
import { useLayer } from '../../hooks/useLayer';


type Props = {
    isShowModal: boolean,
    // isInputError: boolean,
    handleOpen: (value: any) => any,
}


export const ModalAddLayer = (props: Props) => {

    const {
        isShowModal = false,
        // isInputError = false,
        handleOpen,
    } = props

    const {
        handleCloseModalAddLayer,
        handleChangeLayerName,
        isNameExist,
        inputLayerName,
        setInputLayerName,
    } = useLayer()


    const handleCloseModal = () => {
        handleCloseModalAddLayer()
    };

    const handleConfirm = () => {
        handleOpen(inputLayerName)
        setInputLayerName('')
        handleCloseModal()
    };

    const handleKeypress = (e) => {
        if (e.key === "Enter") {
            handleConfirm()
        }
    };

    const handleCancel = () => {
        handleOpen('')
        setInputLayerName('')
        handleCloseModal()
    };

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleOpen}
                dismiss={{ enabled: false }}
                // size={'xs'}
                size={'sm'}
            // size={'md'}
            // size={'lg'}
            // size={'xl'}
            // size={'xxl'}
            // animate={{
            //     mount: {},
            //     unmount: {}
            // }}
            >
                <DialogHeader className="modal-text-title">{`Layer Name`}</DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <Input
                            onChange={handleChangeLayerName}
                            color="gray"
                            variant="static"
                            // label="Layer Name"
                            placeholder="Name e.g Glasses, Hat, Clothes, ..."
                            error={isNameExist}
                            onKeyPress={handleKeypress}
                        />
                        <label className={`textError ${isNameExist ? '' : 'isVisibilityHidden'}`}>Name is exist</label>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        className="mr-1"
                        onClick={handleCancel}
                    >
                        <span>Close</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color={isNameExist || inputLayerName.length <= 0 ? "gray" : "blue"}
                        disabled={isNameExist || inputLayerName.length <= 0}
                        onClick={handleConfirm}
                    >
                        <span>Add Layer</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment>
    )
}