import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isOpenModal: false,
  isShowModalLoading: false,
  isShowModalReCreate: false,
  isShowModalMinting: false,
  typeModalMinting: '',
  isShowModalBurnToken: false,
  isShowModalUpdateMaxSupplySmartContact: false,
  isShowModalUploadIPFS: false,
  isShowModalUploadIPFSLoading: false,
  isErrorUploadIPFS: false,
  isSuccessUploadIPFS: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModalFiled: (state, params: any) => {
      const { payload } = params;
      const { key, value } = payload;

      state[key] = value;
    },
    setModalMinting: (state, params: any) => {
      const { payload } = params;
      const { isShowModalMinting = false, typeModalMinting = '', isShowModalLoading = false } = payload;

      state.isShowModalMinting = isShowModalMinting;
      state.typeModalMinting = typeModalMinting;
      state.isShowModalLoading = isShowModalLoading;
    },
    setModalIPFSFiled: (state, params: any) => {
      const { payload } = params;
      const {
        isShowModalUploadIPFS = false,
        isShowModalUploadIPFSLoading = false,
        isErrorUploadIPFS = false,
        isSuccessUploadIPFS = false,
      } = payload;

      state.isShowModalUploadIPFS = isShowModalUploadIPFS
      state.isShowModalUploadIPFSLoading = isShowModalUploadIPFSLoading
      state.isErrorUploadIPFS = isErrorUploadIPFS
      state.isSuccessUploadIPFS = isSuccessUploadIPFS
    },
  },
}); //  end slice

export const { setModalFiled, setModalMinting, setModalIPFSFiled } = modalSlice.actions;

export const modal = (state: any) => state.modal;

export default modalSlice.reducer;
