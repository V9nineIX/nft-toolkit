import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { includes } from 'lodash'
import { useCollection } from './useCollection'
import { useDispatch } from 'react-redux';
import { setCollection } from '../redux/slices/collectionSlice';

type Props = {
    pageName?: string,
}

type GenerateProps = {
    progressSocket?: number,
    statusSocket?: string,
    ownerIdSocket?: string,
    collectionIdSocket?: string,
    projectDirSocket?: string,
    messageAlertSocket?: string,
    alertType?: string,
    isShowProgress?: boolean,
    isShowMessageAlert?: boolean,
} & typeof defaultGenerateProps;

const defaultGenerateProps = {
    progressSocket: 0,
    statusSocket: '',
    ownerIdSocket: '',
    collectionIdSocket: '',
    projectDirSocket: '',
    alertType: '',
    messageAlertSocket: '',
    isShowProgress: false,
    isShowMessageAlert: false,
};


export const useGenerateSocket = ({
    pageName = 'app', // 'app'||'export'
}: Props) => {

    const dispatch = useDispatch()

    const { collection, previewDetailList } = useSelector((state: any) => state.collection);
    const { _id } = collection

    const [generateSocket, setGenerateSocket] = useState<GenerateProps>(defaultGenerateProps)
    const {
        progressSocket,
        statusSocket,
        ownerIdSocket,
        collectionIdSocket,
        projectDirSocket,
        alertType,
        messageAlertSocket,
        isShowProgress,
        isShowMessageAlert,
    } = generateSocket

    const { updateCollectionStatus } = useCollection({})

    useEffect(() => {
        // create an EventSource connection to the server
        const url = `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/progressGenerateImageSSE`// http://192.168.1.33:3033/progressGenerateImageSSE
        const source = new EventSource(url);
        if ((_id || collection) && pageName == 'app') {
            try {
                // listen for progress messages from the server
                source.addEventListener('message', async (event) => {
                    const data = JSON.parse(event.data);
                    switch (data?.status) {
                        case 'Progressing':
                            const handleProgressing = async (data) => {
                                await setGenerateSocket({
                                    ...generateSocket,
                                    alertType: '',
                                    messageAlertSocket: '',
                                    isShowMessageAlert: false,
                                    progressSocket: Number(data?.progress),
                                    statusSocket: Number(data?.progress) < 100 ? data?.status : 'Completed',
                                    ownerIdSocket: data.ownerId,
                                    collectionIdSocket: data.collectionId,
                                    projectDirSocket: data.projectDir,
                                    isShowProgress: (data.collectionId == _id && includes(data?.status, 'Progressing')),
                                })
                            }
                            handleProgressing(data)
                            break;
                        case 'Completed':
                            const handleCompleted = async (data) => {
                                await setGenerateSocket({
                                    ...generateSocket,
                                    alertType: 'success',
                                    messageAlertSocket: data ? data?.message : '',
                                    isShowMessageAlert: true,
                                    progressSocket: 0,
                                    statusSocket: '',
                                    isShowProgress: false,
                                })
                                await dispatch(setCollection({ key: "status", value: "completed" }));
                                await resetGenerateSocket({ timeOut: 5000 })

                                //TODO update collection status
                                updateCollectionStatus("completed")
                            }
                            handleCompleted(data)
                            break;
                        case 'Failed':
                            const handleFailed = async (data) => {
                                await setGenerateSocket({
                                    ...generateSocket,
                                    alertType: 'error',
                                    messageAlertSocket: data ? data?.message : '',
                                    isShowMessageAlert: true,
                                    progressSocket: 0,
                                    statusSocket: '',
                                    isShowProgress: false,
                                })
                                await dispatch(setCollection({ key: "status", value: "failed" }));
                                await resetGenerateSocket({ timeOut: 5000 })

                                //TODO update collection status
                                updateCollectionStatus("failed")
                            }
                            handleFailed(data)
                            break;
                        default: null
                            break;
                    }
                });

                // handle errors
                source.addEventListener('error', (event) => {
                    console.error('SSE error', event);
                    source.close();
                });
            } catch (error) {
                console.log(`error`, error);
            }
        }
        // cleanup the connection when the component unmounts
        return () => {
            source.close();
        };
    }, [_id, collection]); //collection





    const resetGenerateSocket = async ({ timeOut }: { timeOut?: number }) => {
        await setTimeout(() => {
            setGenerateSocket({
                ...generateSocket,
                progressSocket: 0,
                statusSocket: '',
                isShowProgress: false,
                alertType: '',
                messageAlertSocket: '',
                isShowMessageAlert: false,
            })
        }, timeOut);
    }



    return ({
        statusSocket,
        progressSocket,
        isShowProgress,
        alertType,
        messageAlertSocket,
        isShowMessageAlert,
        previewDetailList,
    })
}