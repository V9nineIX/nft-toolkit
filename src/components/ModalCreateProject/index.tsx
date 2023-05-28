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


export const ModalCreateProject = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
    } = props

    const [projectName, setProjectName] = useState('');

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
                    Create a Project
                    <span>Enter a name for your new project.</span>
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>
                        <div className='mb-6'>
                            <Input
                                type='text'
                                color="gray"
                                label="My new project"
                                onChange={(e) => { setProjectName(e.target.value.trim()) }}
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
                        color={projectName.length <= 0 ? "gray" : "blue"}
                        disabled={projectName.length <= 0}
                        onClick={handleConfirm}
                    >
                        <span>Create Project</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment>
    )
}