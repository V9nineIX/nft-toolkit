import { createSlice } from '@reduxjs/toolkit';
import RootState from '../store'
import { IPostType } from '../../models';

// export interface PostState {
//     title : string;
//     content : string
// }

export const initialState: IPostType = {
    title: "",
    content: ""
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPost: (state) => {
            state.title = "hello"
        }

    }

}) //  end slice


export const { addPost } = postSlice.actions;

export const selectPost = (state: any) => state.post


export default postSlice.reducer;