import { Button } from '@material-tailwind/react'
import { listenerCompleted } from '@reduxjs/toolkit/dist/listenerMiddleware/exceptions'
import React, { Fragment, useEffect, useState } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useLayer } from '../../hooks/useLayer'
import '../../styles/layerWidget.scss'
import LayerGroup from '../LayerGroup'
import { ModalAddLayer } from '../ModalAddLayer'
import { ModalUploadImage } from '../ModalUploadImage'
import Search from '../Search'
import { useGeneratePreview } from '../../hooks/useGeneratePreview'
import Filter from '../Filter'
import { isEmpty } from 'lodash';

type Props = {
  navMenuTab: string,
  pageName: string,
}

export const LayerWidget = (props: Props) => {
  const {
    navMenuTab,
    pageName,
  } = props

  const {
    layers,
    currentSelectedLayerIndex,
    handleModalAddLayer,
    openModalAddLayer,
    handleOpenModalUploadImage,
    handleModalUploadImage,
    openModalUploadImage,
    inputTotalSupply,
    handleRemoveLayer,
    totalSupply,
    handleChangeTotalSupply,
    projectDir,
    handleSelectTrait,
    traitSelectedList,
    isCanUpdateTotalSupply,
    previewDetailList,
    maximumTotalSupply,
  } = useLayer()

  const { handleGeneratePreview } = useGeneratePreview()


  const isHiddenAction = pageName == "Export"
  const isHiddenAddLayer = navMenuTab == "Preview"

  if (navMenuTab == "Custom token" || (pageName == "Export" && isEmpty(layers) || (pageName == "Export" && navMenuTab !== "Export"))) {
    return null
  }


  return (
    <Fragment>
      <div className="containerLayerWidget">
        {isHiddenAction ? null : (
          <div className="containerHeaderLayerWidget">
            {isHiddenAddLayer ? null : (
              <div className="headerSearch">

                {/* <div className="search-layout-widget">
                <Search />
              </div> */}

                <Button
                  className={`w-full h-[40px] p-[2rem]`}
                  onClick={() => handleModalAddLayer({ isAddLayerName: true })}
                  variant="gradient"
                  autoCapitalize="none"
                  size='sm'
                >
                  Add Layer
                </Button>
              </div>
            )}


            <div className='px-3 py-2'>
              <p className='font-semibold text-sm pb-1'>
                Total supply

                {totalSupply > maximumTotalSupply && maximumTotalSupply > 1 && <span className='font-semibold text-[10px] text-red pb-1'>&nbsp;{`(Maximum total supply is ${maximumTotalSupply})`} </span>}

              </p>

              <div className="cover-total-supply">
                <input
                  type="number"
                  value={totalSupply}
                  onChange={(e) => handleChangeTotalSupply(e)}
                />
                {isCanUpdateTotalSupply && (
                  <Button
                    disabled={(totalSupply > maximumTotalSupply) || !isCanUpdateTotalSupply || previewDetailList.length == 0}
                    onClick={() => handleGeneratePreview()}
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}


        <div className="scroll-layer-group"
          style={{
            height:
              isHiddenAction && !isHiddenAddLayer ?
                'calc(100vh - (60px))'
                :
                !isHiddenAction && isHiddenAddLayer ?
                  'calc(100vh - (60px + 76px ))'
                  :
                  'calc(100vh - (60px + 76px + 76px))'
          }}
        >
          {
            isCanUpdateTotalSupply || pageName == "Export" ?
              <Filter />
              :
              <LayerGroup
                items={layers}
                handleOpenModalUploadImage={(e) => handleOpenModalUploadImage(e)}
                handleRemoveLayer={(e) => handleRemoveLayer(e)}
                handleSelectTrait={handleSelectTrait}
                traitSelectedList={traitSelectedList}
              />
          }
        </div>

      </div>

      <ModalAddLayer
        isShowModal={openModalAddLayer}
        handleOpen={(e) => handleModalAddLayer({ value: e, isAddLayerName: false })}
      />

      <ModalUploadImage
        isShowModal={openModalUploadImage}
        handleOpen={handleModalUploadImage}
        title={layers[currentSelectedLayerIndex]?.name || ''}
        projectDir={projectDir}
      />
    </Fragment >
  )
}
