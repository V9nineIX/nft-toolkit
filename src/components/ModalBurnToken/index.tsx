import React, { Fragment } from 'react'
import '../../styles/modalAddLayer.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogFooter,
} from "@material-tailwind/react";

type Props = {
    isShowModal: boolean,
    handleCallbackBurnToken: any,
}


export const ModalBurnToken = (props: Props) => {

    const {
        isShowModal = false,
        handleCallbackBurnToken,
    } = props


    const handleConfirm = async () => {
        handleCallbackBurnToken({ btnType: 'confirm' })
    };

    const handleCancel = () => {
        handleCallbackBurnToken({ btnType: 'cancel' })
    };

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleCallbackBurnToken}
                dismiss={{ enabled: false }}
                size={'md'}
            >

                <DialogHeader className="modal-text-title">
                    Confirm to Burning an NFT
                    <span>Once you burn an NFT, there’s no way to ever recover it.</span>
                </DialogHeader>
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
                        onClick={handleConfirm}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}