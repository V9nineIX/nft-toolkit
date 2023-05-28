import React, { Fragment, useEffect, useState } from 'react'
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
import { split, compact, replace } from 'lodash';

type Props = {
    isShowModal?: boolean,
    handleCallback?: any,
    data?: any,
}

export const ModalEditMinting = ({
    isShowModal = false,
    handleCallback,
    data,
}: Props) => {


    const initialStateMinting = {
        name: data?.name?.length > 0 && data?.typeModalMinting == 'Edit' ? data?.name : "",
        price: (data?.price > 0 || !Number.isInteger(data?.price)) && data?.typeModalMinting == 'Edit' ? data?.price : undefined,
        maxPublicSupply: data?.maxPublicSupply > 0 && data?.typeModalMinting == 'Edit' ? data?.maxPublicSupply : undefined,
        maxTokensPerAddress: data?.maxTokensPerAddress > 0 && data?.typeModalMinting == 'Edit' ? data?.maxTokensPerAddress : undefined,
        totalSupply: Number(data?.totalSupply),
        whiteListAddress: data?.whiteListAddress?.length > 0 && data?.typeModalMinting == 'Edit' ? data?.whiteListAddress : "",
    };

    const [
        { name, price, maxPublicSupply, maxTokensPerAddress, totalSupply, whiteListAddress },
        setStateMinting
    ] = useState(initialStateMinting);

    const [isFirstRender, setIsFirstRender] = useState(true)


    useEffect(() => {
        if (isFirstRender && data) {
            setIsFirstRender(true)
            setStateMinting(initialStateMinting)
        }
    }, [data])


    const isOverSupply = (totalSupply < maxPublicSupply)

    const isCanSave = !!name && !!price && !!maxPublicSupply && !!maxTokensPerAddress && !isOverSupply


    const inputList = [
        {
            label: "Name",
            name: "name",
            value: name,
            type: "text",
            icon: null,
        },
        {
            label: "Price",
            name: "price",
            type: "number",
            pattern: "^\d*(\.\d{0,2})?$",
            step: "0.01",
            value: price,
            icon: <svg className='iconInput' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20" height="20" fill="#7d7d7d"><path d="M 25.984375 0.98632812 A 1.0001 1.0001 0 0 0 25.099609 1.5527344 L 11.169922 23.443359 A 1.0009551 1.0009551 0 0 0 11.107422 23.548828 A 1.0009551 1.0009551 0 0 0 11.105469 23.550781 A 1.0001 1.0001 0 0 0 11.066406 23.640625 A 1.0009551 1.0009551 0 0 0 11.013672 23.833984 A 1.0001 1.0001 0 0 0 11 24.033203 A 1.0009551 1.0009551 0 0 0 11 24.035156 A 1.0001 1.0001 0 0 0 11.007812 24.132812 A 1.0009551 1.0009551 0 0 0 11.011719 24.152344 A 1.0001 1.0001 0 0 0 11.046875 24.298828 A 1.0001 1.0001 0 0 0 11.054688 24.326172 A 1.0009551 1.0009551 0 0 0 11.054688 24.328125 A 1.0001 1.0001 0 0 0 11.091797 24.419922 A 1.0009551 1.0009551 0 0 0 11.091797 24.421875 A 1.0001 1.0001 0 0 0 11.138672 24.507812 A 1.0009551 1.0009551 0 0 0 11.138672 24.509766 A 1.0001 1.0001 0 0 0 11.193359 24.591797 A 1.0009551 1.0009551 0 0 0 11.222656 24.626953 A 1.0001 1.0001 0 0 0 11.257812 24.669922 A 1.0001 1.0001 0 0 0 11.326172 24.740234 A 1.0009551 1.0009551 0 0 0 11.328125 24.742188 A 1.0009551 1.0009551 0 0 0 11.486328 24.859375 A 1.0009551 1.0009551 0 0 0 11.488281 24.861328 A 1.0001 1.0001 0 0 0 11.503906 24.869141 A 1.0009551 1.0009551 0 0 0 11.505859 24.871094 L 25.378906 32.798828 A 1.0001 1.0001 0 0 0 26.613281 32.802734 L 40.474609 24.880859 A 1.0009551 1.0009551 0 0 0 40.496094 24.869141 A 1.0001 1.0001 0 0 0 40.560547 24.828125 A 1.0009551 1.0009551 0 0 0 40.580078 24.814453 A 1.0001 1.0001 0 0 0 40.59375 24.802734 A 1.0009551 1.0009551 0 0 0 40.654297 24.757812 A 1.0009551 1.0009551 0 0 0 40.658203 24.753906 A 1.0001 1.0001 0 0 0 40.669922 24.744141 A 1.0009551 1.0009551 0 0 0 40.730469 24.683594 A 1.0009551 1.0009551 0 0 0 40.794922 24.607422 A 1.0009551 1.0009551 0 0 0 40.849609 24.527344 A 1.0009551 1.0009551 0 0 0 40.851562 24.525391 A 1.0001 1.0001 0 0 0 40.853516 24.519531 A 1.0009551 1.0009551 0 0 0 40.900391 24.439453 A 1.0009551 1.0009551 0 0 0 40.900391 24.4375 A 1.0001 1.0001 0 0 0 40.931641 24.367188 A 1.0009551 1.0009551 0 0 0 40.939453 24.345703 A 1.0001 1.0001 0 0 0 40.947266 24.322266 A 1.0009551 1.0009551 0 0 0 40.966797 24.253906 A 1.0009551 1.0009551 0 0 0 40.96875 24.25 A 1.0001 1.0001 0 0 0 40.970703 24.244141 A 1.0009551 1.0009551 0 0 0 40.988281 24.152344 A 1.0001 1.0001 0 0 0 40.998047 24.076172 A 1.0009551 1.0009551 0 0 0 40.998047 24.068359 A 1.0001 1.0001 0 0 0 41 23.976562 A 1.0001 1.0001 0 0 0 40.996094 23.917969 A 1.0009551 1.0009551 0 0 0 40.990234 23.855469 A 1.0009551 1.0009551 0 0 0 40.990234 23.853516 A 1.0001 1.0001 0 0 0 40.988281 23.84375 A 1.0009551 1.0009551 0 0 0 40.970703 23.759766 A 1.0009551 1.0009551 0 0 0 40.970703 23.755859 A 1.0001 1.0001 0 0 0 40.949219 23.681641 A 1.0009551 1.0009551 0 0 0 40.941406 23.660156 A 1.0001 1.0001 0 0 0 40.931641 23.636719 A 1.0009551 1.0009551 0 0 0 40.904297 23.570312 A 1.0009551 1.0009551 0 0 0 40.902344 23.568359 A 1.0001 1.0001 0 0 0 40.900391 23.5625 A 1.0009551 1.0009551 0 0 0 40.853516 23.480469 A 1.0001 1.0001 0 0 0 40.847656 23.470703 A 1.0009551 1.0009551 0 0 0 40.84375 23.462891 L 40.8125 23.416016 L 26.896484 1.546875 A 1.0001 1.0001 0 0 0 25.984375 0.98632812 z M 25 5.4355469 L 25 17.339844 L 14.583984 21.802734 L 25 5.4355469 z M 27 5.4355469 L 37.416016 21.802734 L 27 17.339844 L 27 5.4355469 z M 25 19.515625 L 25 30.275391 L 14.242188 24.128906 L 25 19.515625 z M 27 19.515625 L 37.757812 24.128906 L 27 30.275391 L 27 19.515625 z M 40.007812 27.998047 A 1.0001 1.0001 0 0 0 39.503906 28.130859 L 26 35.847656 L 12.496094 28.130859 A 1.0001 1.0001 0 0 0 12.019531 28 A 1.0001 1.0001 0 0 0 11.195312 29.59375 L 25.128906 48.503906 A 1.0001 1.0001 0 0 0 26.869141 48.505859 L 40.804688 29.59375 A 1.0001 1.0001 0 0 0 40.007812 27.998047 z M 15.613281 32.216797 L 25 37.582031 L 25 44.957031 L 15.613281 32.216797 z M 36.386719 32.216797 L 27 44.957031 L 27 37.582031 L 36.386719 32.216797 z"></path></svg>,
        },
        {
            label: "Maximum supply",
            span: isOverSupply && `(${totalSupply})`,
            name: "maxPublicSupply",
            type: "number",
            value: maxPublicSupply,
            icon: <>
                {isOverSupply && (
                    <svg className='absolute  !right-[-165px]' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#ff0000"><g><rect fill="none" height="24" width="24" /></g><g><g><g><path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z" /><polygon points="13,16 11,16 11,18 13,18" /><polygon points="13,10 11,10 11,15 13,15" /></g></g></g></svg>
                )}
                <svg className='iconInput' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#7d7d7d"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" /><circle cx="16" cy="12" r="1.5" /></svg>,
            </>
        },
        {
            label: "Maximum per wallet",
            name: "maxTokensPerAddress",
            type: "number",
            value: maxTokensPerAddress,
            icon: <svg className='iconInput' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#7d7d7d"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" /><circle cx="16" cy="12" r="1.5" /></svg>,
        },
        {
            label: "Allow list",
            name: "whiteListAddress",
            placeholder: "Allowlist wallet split with newlines",
            type: "textarea",
            value: whiteListAddress,
        },
    ]

    const clearState = () => {
        setStateMinting({ ...initialStateMinting })
        setIsFirstRender(true)
    };

    const handleConfirm = async () => {
        try {
            setIsFirstRender(false)
            const arrWhiteListAddressList = compact(split(replace(whiteListAddress, /([-\\.,_=)([/\])(["'])([^\\]*?(?:\\.[^\\]*?)*?([,])*)/g, ''), /\r?\n?\s+/))

            handleCallback({
                handleType: "handleConfirm",
                data: {
                    name: name.toString(),
                    price: Number(price),
                    maxPublicSupply: Number(maxPublicSupply),
                    maxTokensPerAddress: Number(maxTokensPerAddress),
                    setIsFirstRender: setIsFirstRender,
                    whiteListAddress: arrWhiteListAddressList,
                }
            })
        } catch (error) {
            console.log('error handle confirm', error)
            setIsFirstRender(true)
        }
    };

    const handleCancel = () => {
        handleCallback({})
        clearState()
    };

    const onChangeInput = ({ event, indexInput }) => {
        const { name, value } = event?.target;

        if ((value > -1 || name == 'name' || name == 'whiteListAddress')) {
            setStateMinting(prevState => ({ ...prevState, [name]: value }));
        }
    };


    return (
        <Fragment>
            <Dialog
                className={'modalAddLayer min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleCallback}
                dismiss={{ enabled: false }}
            >
                <DialogHeader className="flex flex-row  gap-2 items-center justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#7d7d7d">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    <label className="modal-text-title whitespace-nowrap">
                        {data?.typeModalMinting} minting phase
                    </label>
                </DialogHeader>
                <DialogBody>
                    <div className='w-full pt-2 flex flex-col gap-2'>
                        {inputList.map((item, index) => {
                            return (
                                <div key={`input-${item?.name}`}>
                                    {item?.type == 'textarea' ?
                                        <div className='box-textarea-not-label min-w-full  max-w-full flex flex-col gap-4 pt-2 w-full'>
                                            <p className='font-bold text-[18px] whitespace-nowrap' >{item?.label} {item?.span && (<span className="font-bold text-[14px] text-red">{item?.span}</span>)}</p>
                                            <Textarea
                                                color={"gray"}
                                                placeholder={item?.placeholder}
                                                name={item?.name}
                                                value={item?.value}
                                                onChange={(event) => onChangeInput({ event: event, indexInput: index })}
                                            />
                                        </div>
                                        :
                                        <div className='box-input-not-label flex flex-row gap-4 pt-2 justify-between items-center'>
                                            <p className='font-bold text-[18px] whitespace-nowrap' >{item?.label} {item?.span && (<span className="font-bold text-[14px] text-red">{item?.span}</span>)}</p>
                                            <Input
                                                color={"gray"}
                                                placeholder={'Value'}
                                                icon={item?.icon}
                                                type={item?.type}
                                                name={item?.name}
                                                value={item?.value}
                                                pattern={item?.pattern}
                                                step={item?.step || 1}
                                                min={0}
                                                onChange={(event) => onChangeInput({ event: event, indexInput: index })}
                                                className={(item?.icon ? "hasIcon" : "")}
                                            />
                                        </div>
                                    }
                                </div>
                            )
                        })}

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
                                <span>Cancel</span>
                            </Button>
                            <Button
                                variant="gradient"
                                disabled={!isCanSave}
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