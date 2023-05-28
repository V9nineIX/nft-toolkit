export interface ITraitDetailType {
  image: string
  name: string
  traitSelected: boolean
  rarity: number
  count: number
}

export interface ILayerType {
  traitTitle: string
  traitDetail: ITraitDetailType[]
  layerSelected: boolean
  isValid: boolean
  totalCount: number,
  name: string,
  images: any
}
