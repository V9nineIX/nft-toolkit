import { createSlice } from '@reduxjs/toolkit'
import { ICollectionListType, ILayersType } from '../../models'
import { sumBy, isEmpty } from 'lodash'

export interface CollectionState {
  collectionList: ICollectionListType[]
  collection: {
    ownerId: string
    name: string,
    symbol: string,
    description: string,
    defaultPrice: number,
    royaltyFee: number,
    totalSupply: number,
    layers?: Array<ILayersType>,
    status: string,
    phase?: Array<any>,
  },
  currentSelectedLayerIndex: number,
  collectionPreview: any,
  traitSelectedList: any,
  isLoading: boolean,
  isCanUpdateTotalSupply: boolean,
  elementList: any,
  previewList: any,
  filterBadgeList: any,
  previewDetailList: any,
  filterList: any,
  collectionSelectList: [],
  isShowModalPreviewItem: any,
  indexPreviewDetailSelected: any,
  maximumTotalSupply: number,
  customTokenAll: any,
  phasesList: any,
  phasesListSelected: any,
  isShowAlertCard: boolean,
  filterLayerList: any
}

export const initialState: CollectionState = {
  collectionList: [],
  collection: {
    ownerId: '',
    name: '',
    symbol: '',
    description: '',
    defaultPrice: 0,
    royaltyFee: 0,
    totalSupply: 1000,
    layers: [],
    status: "active",
    phase: [],
  },
  currentSelectedLayerIndex: 0,
  collectionPreview: null,
  traitSelectedList: [],
  isLoading: false,
  isCanUpdateTotalSupply: false,
  elementList: [],
  previewList: [],
  filterBadgeList: [],
  previewDetailList: [],
  filterList: [],
  collectionSelectList: [],
  isShowModalPreviewItem: false,
  indexPreviewDetailSelected: null,
  maximumTotalSupply: 1,
  customTokenAll: null,
  phasesList: [],
  phasesListSelected: null,
  isShowAlertCard: false,
  filterLayerList: []
}

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionFiled: (state, params: any) => {
      const { payload } = params
      const { key, value } = payload

      state[key] = value
    },

    setCollectionList: (state, params: any) => {
      const { payload } = params
      const { collection } = payload

      state.collectionList = collection
    },


    setCollection: (state, params: any) => {
      const { payload } = params
      const { key, value } = payload

      state.collection[key] = value
    },

    setInCollection: (state, params: any) => {
      const { payload } = params
      const { data } = payload
      const res = {
        ...state.collection,
        ...data
      }
      state.collection = res
    },

    updateLayerName: (state, params: any) => {
      const { payload } = params
      const { key, value, index } = payload

      state.collection.layers[index][key] = value
    },
    addLayerCollection: (state, params: any) => {
      const { payload } = params

      state.collection.layers.unshift(payload)
    },

    updateLayerImage: (state, params: any) => {
      const { payload } = params

      state.maximumTotalSupply *= !isEmpty(payload) && payload.length > 0 ? payload.length : 1
      state.collection.layers[state.currentSelectedLayerIndex].images = payload
    },

    removeLayerImage: (state, params: any) => {
      const { payload } = params
      const { index } = payload

      state.maximumTotalSupply /= !isEmpty(state.collection.layers[index].images) && state.collection.layers[index].images.length > 0 ? state.collection.layers[index].images.length : 1
      state.collection.layers.splice(index, 1)
    },

    updateImageName: (state, params: any) => {
      const { payload } = params
      const { value, layerIndex, imageIndex } = payload

      state.collection.layers[layerIndex].images[imageIndex].title = value
    },


    updateImageCount: (state, params: any) => {
      const { payload } = params
      const { count, layerIndex, imageIndex, rarity = 0 } = payload

      state.collection.layers[layerIndex].images[imageIndex].rarity = rarity
      state.collection.layers[layerIndex].images[imageIndex].count = count
    },


    varidateTraitCount: (state, params: any) => {
      const { collection } = state
      const { layers, totalSupply } = collection
      const { payload } = params
      const { layerIndex, imageIndex } = payload

      // let sumCount = 0
      let sumRarity = 0
      for (const [key, item] of layers.entries()) {
        if (layerIndex == key) {
          // sumCount = sumBy(item.images, (item) => { return item.count });
          sumRarity = sumBy(item.images, (item) => { return item.rarity });

        }
      }

      // state.collection.layers[layerIndex].isValid = (totalSupply == sumCount)
      state.collection.layers[layerIndex].isValid = (100 == sumRarity)

    },


    // set info of collection
    setCollectionInfo: (state, params: any) => {
      const { payload } = params
      const { previewList, elementList, previewDetailList, filterList } = payload

      state.previewList = previewList ? previewList : state.previewList
      state.elementList = elementList ? elementList : state.elementList // for sending to api
      state.previewDetailList = previewDetailList ? previewDetailList : state.previewDetailList
      state.filterList = filterList ? filterList : state.filterList
    },

    setCollectionStatus: (state, params: any) => {
      const { payload } = params
      const { status } = payload
      state.collection.status = status
    },



    removeTabPreview: (state) => {
      state.collectionSelectList = []
      state.previewDetailList = []
    },

    removeAllCollectionSelectList: (state) => {
      state.collectionSelectList = []
    },

    removeItemCollectionSelectList: (state, params: any) => {
      const { payload } = params
      const { index } = payload
      state.collectionSelectList.splice(index, 1)
    },

    setModalPreviewDetail: (state, params: any) => {
      const { payload } = params
      const { isShowModalPreviewItem = false, indexPreviewDetailSelected = null } = payload

      state.isShowModalPreviewItem = isShowModalPreviewItem
      state.indexPreviewDetailSelected = indexPreviewDetailSelected
    },


    // saga
    checkTraitValid: (params: any) => { },

    // saga
    calculateRarity: () => { },

    // saga
    updateSelectTrait: () => { },

    // saga
    generatePreviewImage: () => { },

    // saga
    generateCollection: (params: any) => { },

    // saga
    generatePreviewCollectionCustomToken: (params: any) => { },


    // saga
    saveCollection: (params: any) => { }







  },
}) //  end slice

export const {
  setCollectionFiled,
  setCollectionList,
  setCollection,
  updateLayerName,
  addLayerCollection,
  updateLayerImage,
  removeLayerImage,
  updateImageName,
  updateImageCount,
  varidateTraitCount,
  checkTraitValid,
  calculateRarity,
  updateSelectTrait,
  generatePreviewImage,
  setCollectionInfo,
  setCollectionStatus,
  removeAllCollectionSelectList,
  removeItemCollectionSelectList,
  removeTabPreview,
  setModalPreviewDetail,
  generateCollection,
  generatePreviewCollectionCustomToken,
  saveCollection,
  setInCollection,
} = collectionSlice.actions

export const collectionState = (state: any) => state.collection

export default collectionSlice.reducer
