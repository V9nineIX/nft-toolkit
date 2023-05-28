import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  tokenList: [],
  isShowModalTokenList: false
};

export const mintSlice = createSlice({
  name: "mint",
  initialState,
  reducers: {
    setMintFiled: (state, params: any) => {
      const { payload } = params;
      const { key, value } = payload;

      state[key] = value;
    },

    setMintComplete: (state, params: any) => {
      const { payload } = params;
      const { tokenList } = payload;

      state.tokenList = tokenList
      state.isShowModalTokenList = true
    },
  },
});

export const { setMintFiled, setMintComplete } = mintSlice.actions;

export const mint = (state: any) => state.mint;

export default mintSlice.reducer;
