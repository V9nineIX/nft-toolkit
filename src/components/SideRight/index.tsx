import { Button } from '@material-tailwind/react'
import React from 'react'
import { useSideRight } from '../../hooks/useSideRight'
import SelectItemCard from '../SelectItemCard'

type SideRightProps = {
}

const SideRight = (props: SideRightProps) => {

    const {
        collection,
        collectionSelectList,
        previewDetailList,
        handleClearAllSelectItem,
        handleClearItemSelectItem,
        handleRemovePreviewDetailList,
    } = useSideRight({})

    const isShowButton = collectionSelectList.length > 0
    const collectionSelectLength = collectionSelectList.length

    return (
        <div className='min-w-[300px] max-w-[300px] min-h-[calc(100vh-60px)] max-h-[calc(100vh-60px)] overflow-hidden  bg-white border border-l-1 px-[1rem]'>
            <div className='flex flex-col justify-between content-between gap-y-[0.5rem]'>

                <div className='flex flex-col justify-center h-[70px] w-full'>
                    <div className='flex flex-row justify-between items-center gap-x-[1rem]'>
                        <label className='font-sans break-words flex flex-1 text-[16px] text-ellipsis font-bold line-clamp-3'>
                            Select item <span className={`text-[14px] text-red ${!isShowButton && 'invisible'}`}>{`(${collectionSelectLength})`}</span>
                        </label>
                        <Button
                            className={`h-max w-max flex flex-none ${!isShowButton && 'invisible'}`}
                            onClick={handleClearAllSelectItem}
                            variant="gradient"
                            autoCapitalize="none"
                            size='sm'
                        >
                            Clear
                        </Button>
                    </div>
                    <span className='text-[14px] pt-1'>
                        select an image that you want to remove
                    </span>
                </div>

                <div className='overscroll-contain shrink grow flex flex-col gap-y-[1rem] overflow-y-auto py-[1rem]  h-[calc(100vh-(60px+0.5rem+70px+60px))]'>
                    {
                        collectionSelectList.map((item, idx) => {
                            if (previewDetailList.length <= 0) return null
                            const dataItem = previewDetailList[item]
                            let data = {
                                name: dataItem?.name,
                                image: dataItem?.image,
                                index: idx,
                            }
                            return (
                                <div className="snap-center" key={`selectItemCard-${idx}`}>
                                    <SelectItemCard
                                        data={data}
                                        handleClearItemSelectItem={handleClearItemSelectItem}
                                    />
                                </div>
                            )
                        })
                    }
                </div>

                <div className={`flex flex-none flex-col w-full ${!isShowButton && 'invisible'}`}>
                    <Button
                        onClick={handleRemovePreviewDetailList}
                        variant="gradient"
                        color='red'
                        autoCapitalize="none"
                    >
                        Remove
                    </Button>
                </div>

            </div>
        </div>
    )
}
export default SideRight
