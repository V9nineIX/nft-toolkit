import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  exportList: [],
  exportFilterList: [],
  exportBadgeList: [],
  exportIndexSelected: 0,
  isShowLoadMore: false,
  isHasMore: false,
  offset: 0,
  limit: 0,
  isLoading: false,
  isShowModal: false,
  nftList: [],
  isGoLaunch: false,
  activeAirDrop: false,
};

export const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    setExportFiled: (state, params: any) => {
      const { payload } = params;
      const { key, value } = payload;

      state[key] = value;
    },
    setActiveAirDrop: (state, params: any) => {
      state.activeAirDrop = !state.activeAirDrop;
    },
  },
}); //  end slice

export const { setExportFiled, setActiveAirDrop } = exportSlice.actions;

export const exportState = (state: any) => state.export;

export default exportSlice.reducer;
