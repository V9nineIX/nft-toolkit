import React, { Fragment, useState } from 'react'
import ImageUploading from 'react-images-uploading';
import '../../styles/modalUploadImage.scss'

import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useLayer } from '../../hooks/useLayer';
import { Collection } from '../../api/collection';
import { useCustomToken } from '../../hooks/useCustomToken'

type imageUploadProps = {
    images: any[]
    setImages: (param: any) => void,
    type: string
}


const ImageUpload = ({ images, setImages, type = '' }: imageUploadProps) => {

    const maxNumber = 9999;
    const typeImage = type == "customToken" ? ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'avif'] : ['png'];

    const onChange = (e: any) => {
        setImages(e);
    };

    return (
        <Fragment>
            <ImageUploading
                multiple
                value={images}
                acceptType={typeImage}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
                {({
                    imageList, onImageUpload, onImageRemove, isDragging, dragProps,
                }) => (
                    <div className="boxUpload">

                        {imageList.length > 0 && (
                            <div className='boxPreviewImage'>
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                        <img src={image['data_url']} alt="" width="100" />
                                        <div className="btnWrapper">
                                            <button
                                                className="btnRemove"
                                                onClick={() => onImageRemove(index)}
                                            >
                                                <div className='remove' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className='btnUpload'
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            Click or Drop here
                        </button>
                    </div>
                )
                }

            </ImageUploading >
        </Fragment >
    );
}


type Props = {
    isShowModal: boolean,
    handleOpen: (value: any) => any,
    title: string,
    projectDir: string,
    type?: string
}


export const ModalUploadImage = (props: Props) => {

    const {
        isShowModal = false,
        handleOpen,
        title = '-',
        projectDir = '',
        type = ""
    } = props

    const {
        handleCloseModalUploadImage,
        collectionId,
    } = useLayer()


    const { handleModal, handleFetchCustomToken } = useCustomToken()

    const [images, setImages] = useState([]);

    const handleCloseModal = () => {
        handleCloseModalUploadImage()
    };

    const handleConfirm = async () => {
        if (type === "customToken") {
            try {
                let formData = new FormData();
                for (const [index, item] of images.entries()) {
                    formData.append('files', item.file);
                }
                formData.append('projectDir', projectDir);
                formData.append('collectionId', collectionId);

                const resLastLayers = await Collection.uploadCustomToken(formData)

                if (resLastLayers) {
                    handleFetchCustomToken()
                }
                setImages([])
                handleOpen([])

            } catch (error) {
                console.log('error', error)
            }

        } else {
            try {
                let formData = new FormData();
                for (const [index, item] of images.entries()) {
                    formData.append('files', item.file);
                }
                formData.append('layer', title);
                formData.append('projectDir', projectDir);
                formData.append('collectionId', collectionId);

                const resLastLayers = await Collection.post(formData)
                // handleOpen(images)
                if (resLastLayers?.data?.layers[0]?.images) {
                    handleOpen(resLastLayers?.data?.layers[0]?.images)
                }
                setImages([])
                handleCloseModal()
            } catch (error) {
                console.log('error', error)
            }
        }
    };

    const handleCancel = () => {
        if (type === "customToken") {
            handleModal()
            handleOpen([])
        } else {
            handleOpen([])
            setImages([])
            handleCloseModal()
        }
    };

    return (
        <Fragment>
            <Dialog
                className={'modalUploadImage min-w-[450px] mobile:min-w-[80%]'}
                open={isShowModal}
                handler={handleOpen}
                dismiss={{ enabled: false }}
                size={'xl'}
            >
                <DialogHeader className="modal-text-title"> {type === "customToken" ? title : `Add ${title} attributes`}</DialogHeader>
                <DialogBody>
                    <div className='containerUploadImage'>
                        <ImageUpload
                            images={images}
                            setImages={setImages}
                            type={type}
                        />
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

                        color={images.length <= 0 ? "gray" : "blue"}
                        disabled={images.length <= 0}
                        onClick={handleConfirm}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog >
        </Fragment>
    )
}