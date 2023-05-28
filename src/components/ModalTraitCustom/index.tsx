import React, { Fragment, useState } from 'react'
import '../../styles/modalAddLayer.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Textarea,
    Input,
} from "@material-tailwind/react";
import { some } from 'lodash'

type Props = {
    isShowModal: boolean,
    handleOpen: any,
    data: any,
    meta: any,
}


export const ModalTraitCustom = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
        data = {},
        meta = {},
    } = props



    const api = import.meta.env.VITE_PUBLIC_API_BASE_URL


    const handleCloseModal = () => {
        handleOpen({})
    };

    const handleConfirm = async () => {
        handleOpen({ handleType: "updateCustomToken" })
    };

    const handleKeypress = (e) => {
        // if (e.key === "Enter") {
        //     handleConfirm()
        // }
    };

    const handleCancel = () => {
        handleOpen({})
    };

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[80vw] '}
                open={isShowModal}
                handler={handleOpen}
                dismiss={{ enabled: false }}
            >
                <DialogHeader className="flex flex-row  gap-6 items-center justify-between">
                    <label className="modal-text-title whitespace-nowrap">
                        Trait custom
                    </label>
                    {data.isErrorSave && (
                        <div className='flex flex-row gap-2 items-center max-w-[70%]'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <span className='font-bold text-red text-[16px]'>Please save your form again and wait until form is finished loading</span>
                        </div>
                    )}
                </DialogHeader>
                <DialogBody>
                    <div className='containerAddLayer'>

                        <div className='flex flex-row gap-4'>

                            {/* Left */}
                            <div className='flex flex-col  box-image gap-4'>
                                <div className='box-image-square border border-solid border-zinc-300 ' style={{ backgroundImage: !!meta?.rawImage && ' none' }}>
                                    {meta?.rawImage && (<img src={`${api + meta?.rawImage}`} />)}
                                </div>

                                <Button
                                    variant="outlined"
                                    color='red'
                                    className='btn-generate whitespace-nowrap w-full focus:shadow-none'
                                    onClick={data.handleDeleteCustomToken}
                                >
                                    Delete Custom Token
                                </Button>

                            </div>
                            {/* Left */}

                            {/* Right */}
                            <div className=' w-full'>
                                <div className='border border-solid border-zinc-300 rounded-card max-h-[57vh] overflow-y-auto scroll-smooth'>

                                    {some(data?.layers, ['isTraitTypeCustom', false]) && (
                                        <>
                                            <div className='p-4'>
                                                <label className='font-bold text-[18px]'>Traits</label>
                                            </div>
                                            <div className='px-4 pt-2'>
                                                {
                                                    data && data?.layers.map((item, index) => {
                                                        if (item?.isTraitTypeCustom) return null
                                                        return (
                                                            <div className='gap-4 mb-3 flex flex-row items-center' key={`inputLayersTrait-${index}`}>
                                                                <label className='flex-1 font-bold'>{`${item.trait_type}`}</label>
                                                                <Input
                                                                    className='flex-1'
                                                                    variant='outlined'
                                                                    color={"gray"}
                                                                    label={'value'}
                                                                    name={`value`}
                                                                    onKeyPress={handleKeypress}
                                                                    value={item.value}
                                                                    onChange={(event) => data.onChangeInputTraitCustom({ event: event, indexInput: index })}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                    )}


                                    <div className='px-4 py-4 flex flex-row justify-between items-center'>
                                        <label className='font-bold text-[18px]'>Custom traits</label>
                                        <Button
                                            variant="outlined"
                                            className='btn-generate whitespace-nowrap'
                                            onClick={data.handleAddTraits}
                                        >
                                            Add Traits
                                        </Button>
                                    </div>

                                    <div>
                                        {
                                            data && data?.layers.map((item, index) => {

                                                if (!item?.isTraitTypeCustom) return null
                                                return (
                                                    <div className='flex flex-row gap-4 mb-3 px-4' key={`inputLayersTrait-${index}`}>
                                                        <Input
                                                            color={"gray"}
                                                            label={`Traits`}
                                                            name={`trait_type`}
                                                            onKeyPress={handleKeypress}
                                                            value={item.trait_type}
                                                            onChange={(event) => data.onChangeInputTraitCustom({ event: event, indexInput: index })}
                                                        />
                                                        <Input
                                                            color={"gray"}
                                                            label={`value`}
                                                            name={`value`}
                                                            onKeyPress={handleKeypress}
                                                            value={item.value}
                                                            onChange={(event) => data.onChangeInputTraitCustom({ event: event, indexInput: index })}
                                                        />
                                                        <button
                                                            onClick={() => data.handleRemoveCustomTraits({ index: index })}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>


                                </div>
                            </div>
                            {/* Right */}

                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className='flex flex-row items-center justify-between w-auto'>
                        {/* {data.isErrorSave && (
                            <div className='flex flex-row gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                </svg>
                                <span className='font-bold text-red'>Please save again</span>
                            </div>
                        )} */}
                        <div>

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
                                // color={((collectionName.length <= 0) && (!totalSupply && totalSupply === 0)) ? "gray" : "blue"}
                                // disabled={(collectionName.length <= 0) && (!totalSupply && totalSupply === 0)}
                                onClick={handleConfirm}
                            >
                                <span>{data.isErrorSave ? 'Save again' : 'Save'}</span>
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}