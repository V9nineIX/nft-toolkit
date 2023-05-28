import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  alertMessage: "",
  isShowAlert: false,
  alertType: "",
};

const UPDATE_SUCCESS = {
  alertMessage: "Update Successful",
  alertType: "success",
};

const UPDATE_ERROR = {
  alertMessage: "Failed to update. Please try again",
  alertType: "error",
};

const UPLOAD_IPFS_SUCCESS = {
  alertMessage: "Upload IPFS Successful",
  alertType: "success",
};

const UPLOAD_IPFS_ERROR = {
  alertMessage: "Upload IPFS Failed",
  alertType: "error",
};

const UPDATE_DELETE_BULK_SUCCESS = {
  alertMessage: "Burned an NFT Successful",
  alertType: "success",
};

const UPDATE_DELETE_BULK_ERROR = {
  alertMessage: "Burned an NFT Failed",
  alertType: "error",
};

const UPDATE_MAX_SUPPLY_SMART_CONTACT_SUCCESS = {
  alertMessage: "Upload max supply smart contact Successful",
  alertType: "success",
};

const UPDATE_MAX_SUPPLY_SMART_CONTACT_ERROR = {
  alertMessage: "Upload max supply smart contact Failed",
  alertType: "error",
};


// ============== list alert ==============
const ALERT_MSG = {
  UPDATE_SUCCESS: UPDATE_SUCCESS,
  UPDATE_ERROR: UPDATE_ERROR,
  UPLOAD_IPFS_SUCCESS: UPLOAD_IPFS_SUCCESS,
  UPLOAD_IPFS_ERROR: UPLOAD_IPFS_ERROR,
  UPDATE_DELETE_BULK_SUCCESS: UPDATE_DELETE_BULK_SUCCESS,
  UPDATE_DELETE_BULK_ERROR: UPDATE_DELETE_BULK_ERROR,
  UPDATE_MAX_SUPPLY_SMART_CONTACT_SUCCESS: UPDATE_MAX_SUPPLY_SMART_CONTACT_SUCCESS,
  UPDATE_MAX_SUPPLY_SMART_CONTACT_ERROR: UPDATE_MAX_SUPPLY_SMART_CONTACT_ERROR,
};

export const alertCardSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlertField: (state, params) => {
      const { payload } = params;
      const { key, value } = payload;

      state[key] = value;
    },

    setAlertDetail: (state, params) => {
      const { payload } = params;
      const { alertKey = "" } = payload;
      const alertInfo = ALERT_MSG[alertKey];

      state.alertMessage = alertInfo?.alertMessage ? alertInfo?.alertMessage : state.alertMessage
      state.alertType = alertInfo?.alertType ? alertInfo?.alertType : state.alertType
      state.isShowAlert = true
    },

    resetAlert: () => initialState
  },
});

export const { setAlertField, setAlertDetail, resetAlert } = alertCardSlice.actions;

export const alert = (state: any) => state.alert;

export default alertCardSlice.reducer;
