import { createSlice } from '@reduxjs/toolkit'
import { calculateRarityLayer } from '../../utils/rarityHelper'
import { ILayerType } from '../../models'
import { calculateRarityTraitDetail } from '../../utils/rarityHelper'

export interface LayerState {
  layer: ILayerType[]
  currentSelectedIndex: number
  totalSupply: number
}

export const initialState: LayerState = {
  layer: [],
  currentSelectedIndex: 0,
  totalSupply: 1000,
}

export const layerSlice = createSlice({
  name: 'layer',
  initialState,
  reducers: {
    setLayerFiled: (state, params: any) => {
      const { payload } = params
      const { key, value } = payload

      state[key] = value
    },

    // addLayer: (state, params: any) => {
    //   const { payload } = params
    //   const data = { ...payload, traitDetail: [], isValid: true, totalCount: 0 }

    //   state.layer = [...state.layer, data]
    // },

    // updateLayer: (state, params: any) => {
    //   const { payload } = params

    //   state.layer[state.currentSelectedIndex].traitDetail = payload
    // },

    // removeLayer: (state, params: any) => {
    //   const { payload } = params
    //   const { index } = payload

    //   state.layer.splice(index, 1)
    // },

    // updateTraitDetail: (state, params: any) => {
    //   const { payload } = params
    //   const { layerIndex, traitDetailPosition, value } = payload

    //   state.layer[layerIndex].traitDetail[traitDetailPosition].count = value

    //   const detail = state.layer.map((item) => item.traitDetail)
    //   const dataLength = detail.map((i) => i.length)[0]

    //   const { rarity } = calculateRarityTraitDetail({
    //     totalSupply: state.totalSupply,
    //     traitDetailLength: dataLength,
    //   })

    //   state.layer[layerIndex].traitDetail[traitDetailPosition].rarity = rarity
    // },

    // Acction saga
    checkTraitValid: (state, params: any) => { },

    varidateTrait: (state, params: any) => {
      const { layer, totalSupply } = state
      const { payload } = params
      const { layerIndex } = payload

      let countList = []
      for (const [key, item] of layer.entries()) {
        if (layerIndex == key) {
          for (const value of item.traitDetail) {
            countList.push(value.count)
          }
        }
      }

      const sumCount = countList.reduce((arr, current) => arr + current, 0)

      state.layer[layerIndex].isValid = totalSupply == sumCount
      state.layer[layerIndex].totalCount = sumCount
    },

    setTotalSupply: (state, params: any) => {
      const { payload } = params
      const { totalSupply } = payload

      const { layer } = calculateRarityLayer({
        totalSupply: totalSupply,
        layer: [...state.layer],
      })

      state.layer = layer
      state.totalSupply = totalSupply
    },


    updateLayerName: (state, params: any) => {
      const { payload } = params
      const { name } = payload

      state.layer[state.currentSelectedIndex].traitTitle = name
    },
  },
}) //  end slice

export const {
  // addLayer,
  // updateLayer,
  setLayerFiled,
  // removeLayer,
  // updateTraitDetail,
  checkTraitValid,
  varidateTrait,
  setTotalSupply,
  updateLayerName
} = layerSlice.actions

export const layerState = (state: any) => state.layer

export default layerSlice.reducer
