import React from "react";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmptyPage = (props) => {
  const { textStatus = "", style = { height: "calc(100vh - 121px)" } } = props;

  return (
    <div
      className="w-full flex flex-col justify-center items-center"
      style={style}
    >
      <FontAwesomeIcon icon={faFolderOpen} className="text-3xl text-gray-400" />
      <p className="mt-4 text-lg text-gray-400 font-medium">{textStatus}</p>
    </div>
  );
};

export default EmptyPage;
