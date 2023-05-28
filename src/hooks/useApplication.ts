import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import  { toggleWalletModal } from "../redux/slices/applicationSlice"

  export function useWalletModalToggle(): () => void {
    const dispatch = useDispatch()
    return useCallback(() => dispatch(toggleWalletModal()), [dispatch])
  }
