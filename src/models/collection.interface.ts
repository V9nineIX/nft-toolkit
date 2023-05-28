export interface ICollectionListType {
    name: string;
    image?: string;
}

export interface ILayersType {
    name?: string;
    images?: [ILayersImageType];
    isValid?: boolean 
}
export interface ILayersImageType {
    name?: string;
    title?: string;
    image?: string;
    rarity?: number;
    count?: number;
}


