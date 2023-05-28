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
    handleCallbackUpdateMaxSupplySmartContact: any,
}


export const ModalUpdateMaxSupplySmartContact = (props: Props) => {

    const {
        isShowModal = false,
        handleCallbackUpdateMaxSupplySmartContact
    } = props


    const handleConfirm = async () => {
        handleCallbackUpdateMaxSupplySmartContact({ btnType: 'confirm' })
    };

    const handleCancel = () => {
        handleCallbackUpdateMaxSupplySmartContact({ btnType: 'cancel' })
    };

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleCallbackUpdateMaxSupplySmartContact}
                dismiss={{ enabled: false }}
                size={'md'}
            >

                <DialogHeader className="modal-text-title">
                    Update max supply smart contract
                    <span>Once you burn an NFT, should update max supply smart contract.</span>
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