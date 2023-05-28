import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    useParams,
    useLocation,
} from 'react-router-dom';
import { setModalFiled, setModalIPFSFiled } from '../redux/slices/modalSlice';
import { Collection } from '../api/collection';
import { getIdCollectionFromSearch } from '../utils/index';
import { setAlertDetail } from '../redux/slices/alertCardSlice';
import { setInCollection } from '../redux/slices/collectionSlice';
import { isEmpty } from 'lodash';

type Props = {}

export const useUploadIPFS = (props: Props) => {


    const dispatch = useDispatch()
    const idCollection = getIdCollectionFromSearch()


    const { collection } = useSelector((state: any) => state.collection);
    const {
        isShowModalUploadIPFS,
        isShowModalUploadIPFSLoading,
        isErrorUploadIPFS,
        isSuccessUploadIPFS,
    } = useSelector((state: any) => state.modal);
    const [secretAccessToken, setSecretAccessToken] = useState('')


    useEffect(() => {

        if (isErrorUploadIPFS) {
            dispatch(
                setAlertDetail({
                    alertKey: 'UPLOAD_IPFS_ERROR'
                })
            )
            setTimeout(() => {
                dispatch(setModalFiled({ key: 'isErrorUploadIPFS', value: false }))
            }, 4000);
        }
    }, [isErrorUploadIPFS])

    useEffect(() => {
        if (isSuccessUploadIPFS) {
            dispatch(
                setAlertDetail({
                    alertKey: 'UPLOAD_IPFS_SUCCESS'
                })
            )
            setTimeout(() => {
                dispatch(setModalFiled({ key: 'isSuccessUploadIPFS', value: false }))
            }, 4000);
        }
    }, [isSuccessUploadIPFS])


    const handleUploadIPFS = async (
        {
            secretAccessToken = '',
            typeStorage = 'nftstorage',
            isCloseModal = false,
        }
    ) => {
        if (isCloseModal) {
            dispatch(setModalIPFSFiled({}))
        } else {
            dispatch(setModalFiled({ key: 'isShowModalUploadIPFSLoading', value: true }))

            try {

                const res = await Collection.uploadIPFS(collection?._id || idCollection,
                    {
                        jwtToken: secretAccessToken,
                        provider: typeStorage,
                    }
                )

                if (!isEmpty(res?.data)) {
                    dispatch(setInCollection({
                        data: res?.data
                    }))
                }

                dispatch(setModalIPFSFiled({
                    isShowModalUploadIPFS: false,
                    isShowModalUploadIPFSLoading: false,
                    isErrorUploadIPFS: false,
                    isSuccessUploadIPFS: true,
                }))

            } catch (error) {
                console.log('error upload IPFS', error)
                dispatch(setModalIPFSFiled({
                    isShowModalUploadIPFS: true,
                    isShowModalUploadIPFSLoading: false,
                    isErrorUploadIPFS: true,
                    isSuccessUploadIPFS: false,
                }))
            }
        }
    }

    const setIsShowModalUploadIPFS = () => {
        dispatch(setModalFiled({ key: 'isShowModalUploadIPFS', value: true }))
    }


    return {
        isShowModalUploadIPFS,
        setIsShowModalUploadIPFS,
        handleUploadIPFS,
        secretAccessToken, setSecretAccessToken,
        isShowModalUploadIPFSLoading,
        isErrorUploadIPFS,
        isSuccessUploadIPFS,
    }
}