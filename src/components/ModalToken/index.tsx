import React, { Fragment, useEffect, useState } from 'react'
import '../../styles/modalAddLayer.scss'
import { TokenCard } from '../TokenCard/index';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import EmptyPage from '../EmptyPage';


type Props = {
    isShowModal: boolean,
    tokenList: Array<any>,
    handleCallback?: () => void,
}

export const ModalToken = ({
    isShowModal = false,
    tokenList = [],
    handleCallback,
}: Props) => {



    const handleCancel = () => {
        handleCallback()
    };

    if (!isShowModal) {
        return null
    }

    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer mobile:min-w-[80%] tablet:min-w-[60%] min-w-[50%]'}
                open={isShowModal}
                handler={handleCallback}
                dismiss={{ enabled: false }}
            >
                <DialogHeader className="flex flex-row  gap-2 items-center justify-start">
                    <label className="modal-text-title whitespace-nowrap">
                        Your Token
                    </label>
                </DialogHeader>
                <DialogBody>
                    <div className='relative w-full py-2  px-3 flex flex-col gap-2 h-[50vh] overflow-y-auto'>
                        <div className={'w-full h-full  flex flex-col gap-4 ' + `${tokenList.length <= 1 ? 'items-center justify-center mobile:px-[22%] tablet:px-[22%] laptop:px-[24%] extra:px-[25%] px-[28%] grid grid-cols-1' : 'grid  mobile:grid-cols-2 grid-cols-3'}`}>
                            {tokenList.length >= 1 ?
                                <>
                                    {tokenList.map((item, index) => {
                                        return (
                                            <div key={`token-card-${index}`}>
                                                <TokenCard
                                                    data={{
                                                        image: item?.image,
                                                        url: item?.url,
                                                    }}
                                                />
                                            </div>
                                        )
                                    })
                                    }
                                </>
                                :
                                <EmptyPage textStatus="Your token not found" style={{ height: "calc(50vh)" }} />
                            }

                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className='flex flex-row items-center justify-between w-auto'>
                        <div>
                            <Button
                                variant="text"
                                color="red"
                                className="mr-1"
                                onClick={handleCancel}
                            >
                                <span>Close</span>
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </Dialog >
        </Fragment >
    )
}