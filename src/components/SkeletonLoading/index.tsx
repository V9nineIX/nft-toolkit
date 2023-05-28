import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoading = (props) => {
  const { height = "230px", isImage = false } = props

  return (
    <div style={{ width: "100%", height: "100%", background: "white", borderRadius: "8px", }}>
      <div
        style={{
          height: height,
          borderRadius: "8px",
        }}
      >
        <Skeleton
          style={{
            borderRadius: isImage ? "8px" : "8px 8px 0px 0px",
            lineHeight: 2,
          }}
          baseColor="#E6E7E8"
          height={height ? '100%' : 160}
        />
        {isImage ? null : 
        <div style={{ padding: "10px" }}>
          <Skeleton inline baseColor="#E6E7E8" borderRadius={"20px"}/>
          <Skeleton
            width={60}
            baseColor="#E6E7E8"
            borderRadius={"20px"}
            style={{ float: "right", marginTop: '10px' }}
          />
        </div>
}
      </div>
    </div>
  );
};

export default SkeletonLoading;
