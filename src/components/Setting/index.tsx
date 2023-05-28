import { useMemo, useState } from "react";
import "./setting.scss";
import { Button } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { useSetting } from "../../hooks/useSetting";
import { setCollection } from "../../redux/slices/collectionSlice";



const RenderInputType = ({ item, inputSetting, handleChange }) => {
  const { name, placeholder, type, title } = item;
  const placeholderText =
    placeholder || title.replace(/([a-z])([A-Z])/g, "$1 $2");

  if (title == "description") {
    return (
      <textarea
        name={name}
        placeholder={placeholderText}
        value={inputSetting["description"] || ""}
        onChange={(e) => handleChange(e)}
      ></textarea>
    );
  } else {
    return (
      <input
        key={name}
        type={type ? type : "text"}
        name={name}
        placeholder={placeholderText}
        value={inputSetting[name] || ""}
        onChange={(e) => handleChange(e)}
      />
    );
  }
};

const Setting = ({ pageName = '' }) => {
  const {
    handleChange,
    inputSetting,
  } = useSetting();


  let listInputLeft = [
    { title: "project name", name: "name" },
    { title: "collection symbol", name: "symbol" },
    {
      title: "description",
      name: "description",
      optional: true,
      placeholder: "brief description",
    },
    // {
    //   name: 'website',
    //   optional: true,
    //   placeholder: 'your website or social media URL',
    // },
  ];
  if (pageName == 'Export') {
    listInputLeft.push(
      {
        title: "Smart Contract Address",
        name: "smartContractAddress",
        optional: false,
        placeholder: "0x00...",
      }
    )
  }

  const listInputRight = [
    {
      title: "defaultPrice",
      name: "defaultPrice",
      desc: "You can set a new price for each new round you create.",
      type: "number",
      placeholder: "5 ETH",
    },
    {
      title: "royaltyFee",
      name: "royaltyFee",
      type: "number",
      placeholder: "0.00-10.00%",
    },
    {
      title: "maxPublicSupply",
      name: "maxPublicSupply",
      type: "number",
      placeholder: "0",
    },
    {
      title: "maxTokensPerAddress",
      name: "maxTokensPerAddress",
      type: "number",
      placeholder: "0",
    },
  ];



  // const validationError = () => {
  //   let errors = {}
  //   if (!inputSetting['projectName']) {
  //     errors['projectName'] = 'The name field is required.'
  //   }

  //   if (inputSetting['collectionSymbol']) {
  //     if (inputSetting['collectionSymbol'].length < 3) {
  //       errors['collectionSymbol'] = 'The collection symbol must be at least 3 characters.'
  //     }
  //   } else {
  //     errors['collectionSymbol'] = 'The collection symbol field is required.'
  //   }

  //   if (!inputSetting['royaltyFee']) {
  //     errors['royaltyFee'] = 'The royalty fee field is required.'
  //   }

  //   if (!inputSetting['price']) {
  //     errors['price'] = 'The price field is required.'
  //   }

  //   // if (!inputSetting['total amount of NFT']) {
  //   //   errors['total amount of NFT'] = 'The target field is required.'
  //   // }

  //   setTextError(errors)
  // }

  // const handleSubmit = () => {
  //   validationError()

  //   const payload = {
  //       projectName: inputSetting['projectName'],
  //       collectionSymbol: inputSetting['collectionSymbol'],
  //       price: inputSetting['price'],
  //       royaltyFee: inputSetting['royaltyFee'],
  //       description: inputSetting['description'] || '',
  //       website: inputSetting['website'] || ''
  //       // totalAmount: inputSetting['total amount of NFT'],
  //   }

  //   dispatch(setProjectInfo({payload}))
  // }

  const InputLabel = ({ item }) => {
    const { name, optional, desc, title } = item;
    const label = title.replace(/([a-z])([A-Z])/g, "$1 $2");

    return (
      <div className="setting-input-label">
        <div className="cover-labe-input">
          <b>{label == "price" ? "default price for public rounds" : label}</b>
          {optional && <span>{" (optional)"}</span>}
          {desc && <p className="input-desc">{desc}</p>}
        </div>
      </div>
    );
  };


  return (
    <div className="wrap-setting">
      {/* <div className="wrap-setting-header">
        <p>Collection</p>
        <Button onClick={() => handleSubmit()}>Save</Button>
      </div> */}

      <div className="setting-content">
        <div className="setting-column">
          {listInputLeft.map((item, index) => (
            <div className="setting-input" key={index}>
              <InputLabel item={item} />
              <RenderInputType

                item={item}
                inputSetting={inputSetting}
                handleChange={(e) => handleChange(e)}
              />
              {/* <p className="text-error">{textError[item.name]}</p> */}
            </div>
          ))}
        </div>

        <div className="setting-column">
          {listInputRight.map((item, index) => (

            <div className="setting-input" key={index}>

              <InputLabel item={item} />
              <RenderInputType

                item={item}
                inputSetting={inputSetting}
                handleChange={(e) => handleChange(e)}
              />
              {/* <p className="text-error">{textError[item.name]}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setting;
