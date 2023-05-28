import React from "react";
import { isEmpty } from "lodash";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Badge = (props) => {
  const { filterBadgeList, handleDeleteBadge, handleClearBadge } = props;

  if (isEmpty(filterBadgeList)) {
    return null;
  }

  return (
    <div>
      {filterBadgeList?.length > 0 ? (
        <>
          <div className="py-2 px-1 flex flex-wrap items-center">
            {filterBadgeList.map((item, index) => (
              <div
                className="border-[1px] w-fit px-2 m-1 rounded-md"
                key={index}
              >
                <span>{item}</span>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="pl-2 hover:cursor-pointer"
                  onClick={() => handleDeleteBadge(item)}
                />
              </div>
            ))}
            <p
              className="ml-3 hover:cursor-pointer text-blue-gray-700 hover:text-light-blue-900"
              onClick={() => handleClearBadge()}
            >
              Clear all
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Badge;
