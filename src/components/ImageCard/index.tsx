import React from "react";
import "./imageCard.scss";
import { faAngleRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useImageCard } from "../../hooks/useImageCard";

const ImageCard = (props) => {
  const {
    item = null,
    indexPreviewDetail,
    isSelected = false,
    pageName = "app",
    isShowQTY = false,
    handleChangeInputQTY = null,
    handleFocusInputQty = null,
  } = props;

  const { handleSelectCard, handleClickDetailButton } = useImageCard();

  const isSelectCard = isSelected ? "isSelected" : "";
  const cursor = pageName == "export" ? "hidden-cursor" : "";

  return (
    <div
      className={`wrap-images-card ${isSelectCard} ${cursor}`}
      onClick={() => handleSelectCard(indexPreviewDetail)}
    >
      <div className="img-card">
        {isSelected ? (
          <div className="cover-icon-check">
            <FontAwesomeIcon icon={faCheck} className={"icon-check"} />
          </div>
        ) : null}
        <img src={item?.image} />
      </div>

      <div className="cover-text-card truncate">
        <p className={`${item?.name ? 'visible' : 'invisible'}`}>{item?.name || 'name'}</p>

        <div
          className={`flex flex-row gap-2 ${
            isShowQTY ? "justify-between" : "justify-end"
          } items-end`}
        >
          {/* show input qty */}
          {isShowQTY ? (
            <div>
              <input
                placeholder="Quantity"
                value={item.qty || ""}
                name={item?.name}
                onChange={(e) => handleChangeInputQTY(e, indexPreviewDetail, item?.edition)}
                className="input-qty w-full"
                onBlur={(e)=>handleFocusInputQty(e, indexPreviewDetail)}
              />
            </div>
          ) : null}

          <div>
            <button
              className="whitespace-nowrap"
              onClick={(e) => handleClickDetailButton(e, indexPreviewDetail)}
            >
              Details
              <FontAwesomeIcon
                icon={faAngleRight}
                className="icon-angle-right"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
