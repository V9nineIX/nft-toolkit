import React from 'react'
import './sideLeftMenu.scss'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSideLeft } from '../../hooks/useSideLeft';

const SideLeftMenu = () => {

  const {
    layers,
    handleDragLayerLeft,
  } = useSideLeft({})

  return (
    <div className='wrap-side-left-menu'>

      <DragDropContext onDragEnd={handleDragLayerLeft}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className='select-none'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                layers && layers.map((item, index) => {
                  return (
                    <Draggable
                      key={`layer-${index}`}
                      index={index}
                      draggableId={index.toString()}
                    >
                      {(provided) => (
                        <div
                          className='select-none'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p>{item.name}</p>
                        </div>
                      )}
                    </Draggable>
                  )
                }
                )}
              {/* {console.log('provided', provided)} */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <label className='select-text text-[12px] text-white text-center py-2'>Drag layers to reorder them</label>
    </div>
  )
}

export default SideLeftMenu
