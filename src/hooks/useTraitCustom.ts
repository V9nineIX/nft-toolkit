import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { map, compact, filter } from 'lodash'
import { useMutation } from "@apollo/client";
import { useCustomToken } from './useCustomToken'
import { DELETE_META, UPDATE_CUSTOM_TOKEN } from '.';

type Props = {
    meta: any,
    getCustomToken: () => any,
}

export const useTraitCustom = ({ meta = [], getCustomToken }: Props) => {

    const [isShowModalTraitCustom, setIsShowModalTraitCustom] = useState<boolean>(false);
    const [isErrorSave, setIsErrorSave] = useState<boolean>(false);
    const [inputTraitCustom, setInputTraitCustom] = useState<boolean>(false);
    const [layersTrait, setLayersTrait] = useState<any>([])
    const { collection } = useSelector((state: any) => state.collection);
    const { _id } = collection

    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)

    const { handleFetchCustomToken } = useCustomToken()


    const [deleteMeta, { data, loading, error }] = useMutation(DELETE_META, {
        onCompleted: (res) => {
            const { deleteMeta } = res

            if (deleteMeta) {
                setIsOpenModalDelete(!isOpenModalDelete)
                setIsShowModalTraitCustom(!isShowModalTraitCustom)
                handleFetchCustomToken()
            }
        }
    });


    const [updateMeta, { data: dataUpdateMeta, loading: loadingUpdateMeta, error: errorUpdateMeta }] = useMutation(UPDATE_CUSTOM_TOKEN);


    useEffect(() => {
        if (!dataUpdateMeta?.updateMeta) {
            setIsShowModalTraitCustom(false)
            getCustomToken()
        }
        setIsErrorSave(!dataUpdateMeta?.updateMeta)
    }, [dataUpdateMeta, loadingUpdateMeta, errorUpdateMeta])

    const reStructureAttributes = ({ dataList = [], isTraitTypeCustom = false }) => {
        return compact(map(dataList, function (e) {
            return {
                trait_type: e?.trait_type,
                value: e?.value || "",
                isTraitTypeCustom: isTraitTypeCustom,
            }
        }))
    }

    const reStructureParamAttributes = ({ dataList = [] }) => {
        return compact(map(dataList, function (e) {
            return {
                trait_type: e?.trait_type,
                value: e?.value || "",
            }
        }))
    }

    useEffect(() => {
        if (isShowModalTraitCustom) {

            const resAttributes = reStructureAttributes({ dataList: meta?.attributes, isTraitTypeCustom: false })
            const resCustomAttributes = reStructureAttributes({ dataList: meta?.customAttributes, isTraitTypeCustom: true })

            setLayersTrait([...resAttributes, ...resCustomAttributes])

        } else {
            setLayersTrait([])
            setIsErrorSave(false)
        }
    }, [isShowModalTraitCustom])


    const onChangeInputTraitCustom = ({ event, indexInput }) => {
        let resLayersTrait = [...layersTrait]
        resLayersTrait[indexInput][event.target.name] = event?.target?.value || ''
        setLayersTrait(resLayersTrait)
    }


    const reStructureUpdateCustomToken = ({ data, attributes }) => {

        const resAttributes = reStructureParamAttributes({ dataList: filter(attributes, ['isTraitTypeCustom', false]) })
        const resCustomAttributes = reStructureParamAttributes({ dataList: filter(attributes, ['isTraitTypeCustom', true]) })


        const res = {
            "edition": parseInt(data?.edition),
            "attributes": resAttributes,
            "customAttributes": resCustomAttributes,
        }

        return res
    }

    const handleModalTraitCustom = ({ handleType = "" }: { handleType?: any }) => {
        try {
            if (handleType == "updateCustomToken") { //Click confirm
                const results = filter([...layersTrait], (element) => { // fitter input empty
                    if (!element.isTraitTypeCustom || (element.trait_type.length !== 0 || element.value.length !== 0)) {
                        return true;
                    }
                    return false;
                });


                const res = reStructureUpdateCustomToken({
                    data: meta,
                    attributes: results,
                })


                updateMeta({
                    variables: {
                        id: _id,
                        meta: res,
                    }
                });

            } else {
                setIsShowModalTraitCustom((prev) => !prev)
            }

        } catch (error) {
            console.log('error update custom token', error)
            setIsErrorSave(true)
        }

    }

    const handleAddTraits = () => {

        let resLayersTrait = [...layersTrait]
        resLayersTrait.push({
            trait_type: "",
            value: "",
            isTraitTypeCustom: true,
        })
        setLayersTrait(resLayersTrait)

    }

    const handleDeleteCustomToken = () => {
        setIsOpenModalDelete(!isOpenModalDelete)
    }

    const handleRemoveCustomTraits = ({ index }: { index: number }) => {
        let resLayersTrait = [...layersTrait]
        resLayersTrait.splice(index, 1)
        setLayersTrait(resLayersTrait)
    }


    const handleDeleteMeta = (edition) => {
        deleteMeta({
            variables: {
                id: _id,
                edition: parseInt(edition)
            }
        })
    }


    return ({
        isShowModalTraitCustom, setIsShowModalTraitCustom,
        handleModalTraitCustom,
        inputTraitCustom, setInputTraitCustom,
        layersTrait, setLayersTrait,
        onChangeInputTraitCustom,
        handleAddTraits,
        handleDeleteCustomToken,
        handleRemoveCustomTraits,
        isErrorSave,
        isOpenModalDelete,
        handleDeleteMeta
    })
}