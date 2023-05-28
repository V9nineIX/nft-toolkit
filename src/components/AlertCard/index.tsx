import { Alert } from '@material-tailwind/react'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { resetAlert } from '../../redux/slices/alertCardSlice';
import { DURATION_DISPLAY_ALERT } from '../../constants/index';

type AlertCardProps = {
    message?: string,
    icon?: any,
    isShow?: boolean,
} & typeof defaultAlertCardProps;

const defaultAlertCardProps = {
    message: 'message',
    type: undefined,
    isShow: false,
}

const AlertCard = (props: AlertCardProps) => {

    const {
        message,
        type,
        isShow,
    } = props




    const dispatch = useDispatch()
    const { isShowAlert } = useSelector((state: any) => state.alertCardSlice);

    useEffect(() => {
        if (isShowAlert) {
            setTimeout(() => {
                dispatch(resetAlert())
            }, DURATION_DISPLAY_ALERT);
        }
    }, [isShowAlert]);


    const typeAlert = {
        error: {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            ,
            color: 'red'
        },
        success: {
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ,
            color: 'green'
        },
    }
    return (
        <div className='fixed top-0 right-0 min-w-min max-w-[400px] z-[22000] mt-2 mr-1' >
            <Alert
                className='!w-fit'
                animate={{
                    mount: { x: 0 },
                    unmount: { x: 500 },
                }}
                variant={'gradient'}
                color={type ? typeAlert[type].color : 'blue'}
                icon={type ? typeAlert[type].icon : null}
                show={isShow}
            >
                {message}
            </Alert>
        </div>
    )
}
export default AlertCard;