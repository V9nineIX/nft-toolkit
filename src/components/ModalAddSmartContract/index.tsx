import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { EthereumIcon } from "../../icons";
import { faXmark, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collection } from "../../api/collection";
import { useDispatch } from "react-redux";
import { setCollectionFiled } from '../../redux/slices/collectionSlice'
import { isEmpty } from 'lodash'


const ModalAddSmartContract = (props) => {
  const {
    isOpen = false,
    handleOpen = null,
    data = null,
    setIsOpenModalSelectWallet = null,
    handleCreateSmartContract = null,
    collectionId = null
  } = props;

  const dispatch = useDispatch()

  const { name, symbol, maxPublicSupply, maxTokensPerAddress, defaultPrice, totalSupply } = data;
  const list = [
    {
      name: "Ethereum",
    },
  ];

  const [indexSelected, setIndexSelected] = useState(0);
  const [inputList, setInputList] = useState([
    { name: "name", value: name || "", placeholder: "Project Name" },
    { name: "symbol", value: symbol || "", placeholder: "Token Symbol" },
    {
      name: "maxPublicSupply",
      value: maxPublicSupply || "",
      placeholder: "Max Public Supply",
    },
    {
      name: "maxTokensPerAddress",
      value: maxTokensPerAddress || "",
      placeholder: "Max Tokens Per Address",
    },
    { name: "defaultPrice", value: defaultPrice || "", placeholder: "Price" },
  ]);

  const getAccount = localStorage.getItem("isConnected");

  const renderIcon = (name: String, selected: boolean) => {
    if (name == "Ethereum") {
      return (
        <EthereumIcon
          fill={`${selected ? "#3B82F6" : "#677489"}`}
          size={25}
          className="mr-2"
        />
      );
    }
  };

  const handleContinue = () => {
    setIsOpenModalSelectWallet(true);
  };

  const handleChange = (e, index) => {
    const { value } = e.target;
    let newValue = [...inputList];
    newValue[index].value = value;

    setInputList(newValue);
  };


  const handleCreate = async () => {
    let paramCollection = { ...data }
    delete paramCollection["createdAt"]
    delete paramCollection["updatedAt"]
    delete paramCollection["__v"]
    delete paramCollection["_id"]

    for (const item of inputList) {
      if (item.name == 'name' || item.name == 'symbol') {
        paramCollection[item.name] = item.value.toString()
      } else {
        paramCollection[item.name] = Number(item.value)
      }
    }

    const res = await Collection.updateCollectionById({ collectionId: collectionId, data: paramCollection });

    if (!isEmpty(res?.data)) {
      dispatch(setCollectionFiled({
        key: 'collection',
        value: res?.data
      }))


      // create smart contract
      handleCreateSmartContract(res?.data)
    }
  };

  const findMaxSupply = inputList.find((item) => item.name == "maxPublicSupply")
  const isOverLimit = (findMaxSupply.value == "" || Number(findMaxSupply.value) > totalSupply) || totalSupply < maxPublicSupply

  return (
    <Dialog open={isOpen} handler={null} size={"md"}>
      <DialogHeader className="px-6 flex justify-between">
        <p>Create New Contract</p>
        <FontAwesomeIcon
          icon={faXmark}
          className="text-blue-gray-400 hover:cursor-pointer"
          onClick={handleOpen}
        />
      </DialogHeader>
      <DialogBody className="px-6 flex flex-col h-[400px] overflow-y-auto">
        <div className="grid grid-cols-2 w-full gap-4 ">
          {inputList.map((item, index) => {
            const isOverTotalSupply = item?.name == "maxPublicSupply" && isOverLimit

            return <div key={index}>
              <p className="mb-1 font-medium text-black">{item.placeholder}
                {
                  isOverTotalSupply &&
                  <span className="text-red pl-1">
                    ({totalSupply})
                  </span>
                }
              </p>
              <div className="relative">
                <input
                  name={item.name}
                  className="border-[1px] border-solid border-blue-gray-300 rounded-md py-1 px-2 w-full"
                  value={item.value || ""}
                  onChange={(e) => handleChange(e, index)}
                />
                {isOverTotalSupply && <FontAwesomeIcon icon={faWarning} className="text-red absolute right-2 top-2" />}
              </div>
            </div>
          })}
        </div>

        <div className="mt-[30px] w-full">
          <p className="mb-2 font-medium text-black">Network</p>
          {list.map((item, index) => (
            <button
              onClick={() => setIndexSelected(index)}
              className={`flex flex-row items-center border-[1px] border-solid rounded-md w-full text-left p-4 text-base mb-2 ${indexSelected == index ? "border-blue" : "border-blue-gray-300"
                }`}
              key={index}
            >
              {renderIcon(item.name, indexSelected == index)}
              <span
                className={`${indexSelected == index ? "text-blue" : "text-blue-gray"
                  }`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="filled"
          onClick={() =>
            getAccount == "true" ? handleCreate() : handleContinue()
          }
        //   disabled={isOverLimit}
        >
          <span>
            {getAccount == "true" ? "Create smart contract" : "Connect"}
          </span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalAddSmartContract;
