import React from "react";
import "../../styles/modalLoading.scss";

const ModalLoading = ({ isShowLoading = false }) => {
  if (!isShowLoading) {
    return null;
  }

  return (
    <div className="wrap-modal-loading">
      <div className={"lds-spinner"}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ModalLoading;
