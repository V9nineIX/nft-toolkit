import { createSlice } from '@reduxjs/toolkit';



export interface ApplicationState {
    isShowModalWallet: boolean,
    isConnectError: boolean,
    connectErrorMessage: string,
    ownerId: string,
    // blockNumber: { [chainId: number]: number }
}

export const initialState: ApplicationState = {
    isShowModalWallet: false,
    isConnectError: false,
    connectErrorMessage: "",
    ownerId: "",
    // blockNumber: {},
}

export const appSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setAppFiled: (state, params: any) => {
            const { payload } = params
            const { key, value } = payload

            state[key] = value
        },
        toggleWalletModal: (state) => {
            state.isShowModalWallet = !state.isShowModalWallet
            state.isConnectError = false
        },
        setConnectError: (state, action) => {
            const { payload } = action
            const { isConnectError, connectErrorMessage } = payload
            state.isConnectError = isConnectError
            state.connectErrorMessage = connectErrorMessage
        }

    }


}) //  end slice


export const { toggleWalletModal, setConnectError, setAppFiled } = appSlice.actions;
export default appSlice.reducer;