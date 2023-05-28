import React from "react";
import "./loading.scss";

const Loading = () => {
  return (
    <div className="wrap-loading">
      <span className="loader"></span>
      <p className="text-loading">Loading...</p>
    </div>
  );
};

export default Loading;
