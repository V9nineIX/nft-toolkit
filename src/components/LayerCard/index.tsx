import host from '../../constants/host';
import './layerCard.scss'

interface LayerCardProps {
  items: { image?: string; path?: string, name: string; title: string; traitSelected: boolean },
  handleSelectTrait: Function,
  layerIndex: any,
  imageIndex: any,
  traitSelectedList: any
}

const LayerCard = (props: LayerCardProps) => {
  const { items, handleSelectTrait, layerIndex, imageIndex, traitSelectedList } = props
  let imgItem = ''
  if (items?.image) {
    imgItem = items.image
  } else if (items?.path) {
    imgItem = host.baseImg + items.path
  }
  

  const isActive = traitSelectedList.some((item, index) => {
    if(index == layerIndex && item.name == items.name){
      return true
    }
  }) 
  
  return (
    <div className="wrap-layer-card">
      <div className="wrap-layer-image">
        <img className={`layer-image  ${isActive? 'isActive': ''}`} src={imgItem} onClick={()=> handleSelectTrait(layerIndex,imageIndex)}/>
      </div>
      <p className="layer-name" title={items.title}>{items.title}</p>
    </div>
  )
}

export default LayerCard
