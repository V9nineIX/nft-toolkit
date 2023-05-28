import { createSlice, Action } from '@reduxjs/toolkit';
import RootState from '../store'

export const initialState: Object = {
    listMeta: [],
    listSearchMeta: []
}

export const metaSlice = createSlice({
    name: 'meta', // name of reducer
    initialState,  //  init state
    reducers: { // function
        setListMeta: (state, action) => {
            const { listMeta, listSearchMeta } = action.payload
            // state.listMeta = [...listMeta]
            // state.listSearchMeta = [...listSearchMeta]
        }

    }

}) //  end slice

export const { setListMeta } = metaSlice.actions; // export reducer function
export const selectMeta = (state: any) => state.meta // export  select state 
export default metaSlice.reducer;


//how to use 

// dispatch(
//     setListMeta({ 
//     listMeta : data.metas,
//     listSearchMeta : res
// }))