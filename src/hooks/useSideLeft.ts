import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCollection } from "../redux/slices/collectionSlice";

type Props = {};

export const useSideLeft = (props: Props) => {
  const dispatch = useDispatch();
  const { collection, collectionSelectList, previewDetailList } = useSelector(
    (state: any) => state.collection
  );
  const { layers } = collection
  let itemsLayersList: any = [...layers] || []


  const handleReorder = ({ list, startIndex, endIndex }) => {
    let result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleDragLayerLeft = (result) => {
    if (!result.destination) {
      return;
    }

    const itemsList = handleReorder(
      {
        list: itemsLayersList,
        startIndex: result.source.index,
        endIndex: result.destination.index,
      }
    );

    itemsLayersList = itemsList

    dispatch(
      setCollection({
        key: 'layers',
        value: itemsLayersList
      })
    )
  }


  return {
    layers: layers || [],
    handleDragLayerLeft,
  };
};
