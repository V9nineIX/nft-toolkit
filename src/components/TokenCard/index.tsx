import { Button } from '@material-tailwind/react'
import React from 'react'
import { isEmpty } from 'lodash';

type Props = {
    data?: any,
}

export const TokenCard = ({
    data,
}: Props) => {

    const {
        image,
        url,
    } = data

    const imageCover = image ? image : '../../../src/image/imageEmpty.svg'
    const linkShare = `https://twitter.com/intent/tweet?text=${url}`

    return (
        <div className='flex bg-white p-4 rounded-card shadow-card'>

            <div className='flex flex-col gap-4 w-full'>
                <div className='aspect-square w-[100%] h-[100%] shadow-card rounded-card bg-bgCover overflow-hidden'>
                    <img
                        className='w-full h-full text-transparent'
                        src={imageCover}
                        alt='cover-nft'
                    />
                </div>
                {!isEmpty(url) && url != "#" && (
                    <div className='flex justify-between items-center gap-4 w-full'>
                        <Button
                            className='p-2 text-[12px] w-full h-fit !border-bgDark !text-bgDark'
                            variant='outlined'
                            onClick={() => {
                                window.open(
                                    url,
                                    '_blank'
                                );
                            }}
                        >
                            View on OpenSea
                        </Button>

                        <Button
                            className='p-2 text-[12px] w-full h-full !bg-bgDark'
                            onClick={() => {
                                window.open(
                                    linkShare,
                                    '_blank'
                                );
                            }}
                            hidden
                        >
                            Share tweet
                        </Button>

                    </div>
                )}

            </div>

        </div >
    )
}