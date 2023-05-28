import { createSlice } from '@reduxjs/toolkit'
import { IProjectInfoType } from '../../models'

export interface SettingState {
  projectInfo: IProjectInfoType | {}
}

export const initialState: SettingState = {
  projectInfo: {},
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {

    setProjectInfo: (state, params: any) => {
      const { payload } = params
      const { key, value } = payload

      state.projectInfo[key] = value
    },
  },
}) //  end slice

export const { setProjectInfo } = settingSlice.actions

export const settingState = (state: any) => state.setting

export default settingSlice.reducer
