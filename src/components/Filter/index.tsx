import React, { useEffect, useCallback, useMemo } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Checkbox,
} from "@material-tailwind/react";
import { useFilter } from "../../hooks/useFilter";
import "./filter.scss";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from 'lodash'

const Filter = (props) => {
  const { filterList = [], isUnmintTab = false } = props
  const {
    layerSelectList,
    handleOpen,
    layers,
    handleSelectFilter,
    filterBadgeList,
    previewDetailList,
    exportFilterList
  } = useFilter();

  if ((isEmpty(previewDetailList) || isEmpty(layers)) && isEmpty(exportFilterList)) {
    return null
  }

  const layer = isUnmintTab ? filterList : !isEmpty(exportFilterList) ? exportFilterList : layers


  
  return (
    <div className="wrap-filter">
      <p className="font-bold text-xl mb-4 text-blue-gray-700">Filter</p>
      {layer.map((layerValue, layerIndex) => {
        const open = layerSelectList.some((i) => i == layerIndex);

        // display icon
        const icon = open ? (
          <FontAwesomeIcon icon={faAngleDown} />
        ) : (
          <FontAwesomeIcon icon={faAngleUp} />
        );

        return (
          <Accordion
            key={layerIndex}
            open={open}
            icon={icon}
            className="accordion-box border-blue-gray-700"
          >
            <AccordionHeader
              onClick={() => handleOpen(layerIndex)}
              className="accordion-header text-blue-gray-700"
            >
              {layerValue.name}
            </AccordionHeader>
            <AccordionBody className="accordion-body">
              {layerValue.images.map((imgValue, imgIndex) => {
                const checked = filterBadgeList.some(
                  (i) => i == imgValue.name
                );

                return (
                  <Checkbox
                    id={imgValue.name + imgIndex}
                    checked={checked}
                    key={imgIndex}
                    color={'blue-gray'}
                    label={imgValue.name}
                    onChange={() => handleSelectFilter(imgValue, isUnmintTab ? layerValue.name : null)}
                  />
                );
              })}
            </AccordionBody>
          </Accordion>
        );
      })}
    </div>
  );
};

export default Filter;
