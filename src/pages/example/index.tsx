import { useDispatch , useSelector} from 'react-redux'
import React, { useState } from 'react'
import {useEffect} from 'react';
import { usePost } from '../../hooks/usePost'


const Example  = () =>{

    const appState = useSelector( (state:any) => state.application)
    const { postState } = usePost()

     useEffect(() => {
        console.log("postState" , postState)
     },[])     

     return(
         <div>Example</div>
     )
} 

export default Example