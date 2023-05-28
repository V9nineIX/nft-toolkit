import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import  { addPost } from "../redux/slices/postSlice"



  export const usePost = () => {
    const dispatch = useDispatch()
    const postState = useSelector( (state:any) => state.post)


    const insterPost = () => {
        //dispatch(addPost())
    }
    
    return {
        postState
    }
  }
