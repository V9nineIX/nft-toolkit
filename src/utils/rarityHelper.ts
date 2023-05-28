
interface calculateRarityTraitDetailProp {
    totalSupply: number,
    traitDetailLength: number,
    rarityInput: any,
    isRarityInput: boolean
}
export function calculateRarityTraitDetail({ totalSupply = 0, traitDetailLength, rarityInput = 0, isRarityInput = false }: calculateRarityTraitDetailProp) {

    // const count = isTotalSupply ? Math.floor(Number(totalSupply) / Number(traitDetailLength)) : totalCount
    // // const count = Math.floor(Number(totalCount) / Number(traitDetailLength))
    // const rarity = Math.floor((count / Number(totalSupply)) * 100)


    const total = totalSupply / traitDetailLength
    const rarity = isRarityInput ? rarityInput : (total / Number(totalSupply)) * 100
    const count =  isRarityInput ? Math.ceil((rarity * Number(totalSupply)) / 100) : total

    return {
        count: count,
        rarity: rarity
    }
}


interface calculateRarityLayerProp {
    totalSupply: number,
    layer: any,
}
export function calculateRarityLayer({ totalSupply, layer }: calculateRarityLayerProp) {


    let res = layer.map((itemLayer: any, indexLayer: Number) => {

        const { detail } = calculateRarityInsideLayer({ traitDetail: itemLayer.traitDetail, totalSupply: totalSupply })

        return ({
            ...itemLayer,
            traitDetail: detail,
            totalCount: totalSupply,
            isValid: true
        })
    });

    return {
        layer: res
    }
}
interface calculateRarityInsideLayerProp {
    traitDetail: any,
    totalSupply: number,
    isTotalSupply?: boolean,
    isRarityInput?: boolean
}
export function calculateRarityInsideLayer({ traitDetail, totalSupply, isTotalSupply = false, isRarityInput = false }: calculateRarityInsideLayerProp) {

    let sumRarity = 0
    let detail = traitDetail.map((itemTraitDetail: any, indexTraitDetail: Number) => {
        const { count, rarity } = calculateRarityTraitDetail({ totalSupply: totalSupply, traitDetailLength: traitDetail.length, rarityInput: itemTraitDetail.rarity || 0, isRarityInput: isRarityInput })

        let resCount: Number = count
        let resRarity: Number = rarity

        sumRarity += Math.floor(rarity)

        // const data = count.toFixed(1).toString().split('.')

        const roundUpDecimal = () => {
            // resCount = Math.ceil(Number(totalSupply) - (count * (traitDetail.length - 1))) // if has decimal will be round up
            resRarity = Math.round((Number(resCount) / Number(totalSupply)) * 100) // < 0.5 not round
            
        }

        const roundDownDecimal = () => {
            // resCount = Math.floor(Number(totalSupply) - (count * (traitDetail.length - 1)))
            resRarity = Math.floor((Number(resCount) / Number(totalSupply)) * 100)
        }


        // set Default
        // if(isTotalSupply) {

        //     // roundup decimal 2 index
        //         if( parseInt(data[1]) >= 5 && isDecimal) {
        //             if(indexTraitDetail == 0 || indexTraitDetail == 1){
        //                 roundUpDecimal()
        //             } else {
        //                 roundDownDecimal()
        //             }
        //         } 
                
                
        //         // rounsup decimal 1 index
        //         if (parseInt(data[1]) < 5 && isDecimal) {

        //             if(indexTraitDetail == 0) {
        //                 // roundUpDecimal()
        //                 if(sum < 100) {
        //                     const number_diff = 100 - sum
        //                     resRarity = Math.floor(rarity + number_diff)
        //                 }
                       
                        
        //             } else {
        //                 roundDownDecimal()
        //             }
                
        //     } else {
               

        //     }

        // }

        return {
            ...traitDetail[Number(indexTraitDetail)],
            rarity: resRarity,
            count: resCount
        }
    })


    return ({ detail: detail, sumRarity });
}