import React from 'react'
import { iconXCircle } from '../../constants/icon'


type SelectItemCardProps = {
    data: any,
    handleClearItemSelectItem: any,
}

const SelectItemCard = (props: SelectItemCardProps) => {
    const {
        data,
        handleClearItemSelectItem,
    } = props
    const {
        name,
        image,
        index,
    } = data

    return (
        <div>
            <div className='flex flex-row gap-[1rem]'>
                <div className='flex flex-none aspect-square'>
                    <div className='relative'>
                        <button
                            className='absolute top-[-0.75rem] right-[-0.75rem] w-[1.5rem] h-[1.5rem] text-primaryMain drop-shadow-icon'
                            onClick={() => handleClearItemSelectItem({ index: index })}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <img
                            className={'aspect-square min-w-selectItemCard max-w-selectItemCard w-selectItemCard  h-selectItemCard rounded-cardSM'}
                            src={image}
                            alt={name}
                        />
                    </div>
                </div>
                <label className='flex flex-1 break-words text-[12px]'>{name}</label>
            </div>
        </div >
    )
}
export default SelectItemCard
