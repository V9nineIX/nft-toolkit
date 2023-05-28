import { Fragment } from "react";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { faClose, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmptyPage from "../EmptyPage/index";
import { every } from 'lodash'


const ModalPreviewItem = (props: any) => {
  const {
    isShowModalPreviewItem,
    handleCloseModalPreview,
    detail,
    collectionName,
  } = props;

  return (
    <Fragment>
      <Dialog
        className={"min-w-[450px] mobile:min-w-[80%] min-h-[500px] h-[500px]"}
        open={isShowModalPreviewItem}
        handler={null}
        size="lg"
      >
        {/* <DialogHeader className="flex justify-end pb-0">
          <FontAwesomeIcon
            icon={faClose}
            className="cursor-pointer text-zinc-400 hover:text-zinc-600"
            onClick={() => handleCloseModalPreview()}
          />
        </DialogHeader> */}
        <DialogBody className="h-[500px]">
          <div className="grid grid-cols-2 w-full">
            <div className="flex justify-center align-top">
              <img src={detail?.image} className="rounded-xl object-contain" />
            </div>

            <div className="pl-4">
              <div className="flex justify-between">
                <p className=" mb-2 font-medium">{collectionName}</p>
                <FontAwesomeIcon
                  icon={faClose}
                  className="cursor-pointer text-zinc-400 hover:text-zinc-600"
                  onClick={() => handleCloseModalPreview()}
                />
              </div>
              <p className="mb-4 font-bold text-slate-600 text-2xl">
                {detail?.name}
              </p>

              <p className="mb-1 font-medium">Properties</p>
              {detail?.attributes.length <= 0 || every(detail?.attributes, { 'value': '' }) ? (
                <>
                  <div
                    className="w-full  h-[340px]  flex flex-col justify-center items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      // enable-background="new 0 0 24 24"
                      height="60px"
                      viewBox="0 0 24 24"
                      width="60px"
                      fill="#9CA3AF"
                    >
                      <g>
                        <rect fill="none" height="20" width="20" />
                      </g>
                      <g>
                        <g>
                          <g>
                            <path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z" />
                            <polygon points="13,16 11,16 11,18 13,18" />
                            <polygon points="13,10 11,10 11,15 13,15" />
                          </g>
                        </g>
                      </g>
                    </svg>
                    <p className="mt-4 text-lg text-gray-400 font-medium">
                      Properties is empty
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-[340px] overflow-y-auto">
                    <div className="grid desktop:grid-cols-3 extra:grid-cols-4 gap-2">
                      {detail?.attributes.map((item, index) => {
                        if (!item?.value) return null;
                        return (
                          <div
                            key={index}
                            className="border border-solid border-zinc-300 py-4 rounded-md text-center w-full px-2 h-fit"
                          >
                            <p className="text-sm">{item?.trait_type}</p>
                            <p
                              className="text-slate-600 font-semibold text-sm truncate"
                              title={item?.value}
                            >
                              {item?.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
};

export default ModalPreviewItem;
