import LayerCard from '../LayerCard'
import './layerGroup.scss'
import { Button } from '@material-tailwind/react'
import { ILayerType } from '../../models/layer.interface'

interface LayerGroupProps {
  items: ILayerType[],
  handleOpenModalUploadImage: any,
  handleRemoveLayer: any,
  handleSelectTrait: Function,
  traitSelectedList: any
}

const LayerGroup = (props: LayerGroupProps) => {
  const {
    items = [],
    handleOpenModalUploadImage,
    handleRemoveLayer,
    handleSelectTrait,
    traitSelectedList
  } = props

  return (
    <>
      {items.map((item, index) => (
        <div className="wrap-layer-group" key={index}>
          <div className="layer-group-header">
            <span>{item.name}</span>
            <button
              className="btnRemoveLayer"
              onClick={() => handleRemoveLayer({ index: index, item: item })}
            >
              <div className='remove' />
            </button>
          </div>

          {item.images.length > 0 ? (
            <div className="cover-layer">
              {
                item.images.map((value, idx) => (
                  <div key={idx}>
                    <LayerCard items={value} handleSelectTrait={handleSelectTrait} imageIndex={idx} layerIndex={index} traitSelectedList={traitSelectedList}/>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="upload-image-button">
              <Button
                onClick={() => handleOpenModalUploadImage({ index: index, })}
                variant="gradient"
                autoCapitalize="none"
              >
                Upload Image
              </Button>
            </div>
          )}
        </div>
      ))
      }
    </>
  )
}

export default LayerGroup
