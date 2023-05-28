import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { isEmpty } from "lodash";
import {
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModalMessage = (props) => {
  const {
    isOpenModal = false,
    btnLeft = "",
    btnRight = "",
    content = "",
    btnLeftColor = "blue",
    btnRightColor = "blue",
    handleBtnLeft = null,
    size = "sm",
    handleBtnRight = null,
    btnText = "",
    handleBtnText = null,
    btnLeftDisable= false,
    btnRightDisable= false
  } = props;

  if (isEmpty(content)) {
    return null;
  }

  return (
    <Dialog open={isOpenModal} handler={handleBtnLeft} size={size}>
      <DialogHeader className="flex flex-row justify-end">
        <FontAwesomeIcon
          icon={faXmark}
          className="text-xl mb-4 text-stone-500 hover:cursor-pointer"
          onClick={handleBtnLeft}
        />
      </DialogHeader>
      <DialogBody className="flex flex-col justify-center items-center pt-0 pb-4 px-4">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-5xl mb-4"
        />
        <div className="font-medium text-md text-center">{content}</div>
      </DialogBody>
      <DialogFooter className={`flex justify-center py-6 ${!isEmpty(btnText) && 'flex-col'}`}>
        {!isEmpty(btnLeft) && (
          <Button color={btnLeftColor} onClick={handleBtnLeft} className="mr-3" disabled={btnLeftDisable}>
            <span>{btnLeft}</span>
          </Button>
        )}

        {!isEmpty(btnRight) && (
          <Button color={btnRightColor} onClick={handleBtnRight} disabled={btnRightDisable}>
            <span>{btnRight}</span>
          </Button>
        )}

        {!isEmpty(btnText) && (
         <p className="mt-6 text-sm hover:cursor-pointer hover:underline text-center" onClick={handleBtnText}>{btnText}</p>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default ModalMessage;
