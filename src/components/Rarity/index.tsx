

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLayer } from "../../hooks/useLayer";

import AlertMessage from "../AlertMessage";
import "./rarity.scss";
import { sumBy } from "lodash";
import host from "../../constants/host";
import { isEmpty } from 'lodash'
import EmptyPage from '../EmptyPage'

const Rarity = () => {
  const dispatch = useDispatch();
  const {
    totalSupply,
    layers,
    checkTraitValid,
    updateLayerName,
    updateImageName,
  } = useLayer();

  const inputRef = useRef();
  const [isOnBlur, setIsOnBlur] = useState(false)
  const [imageIndex, setImageIndex] = useState(null)


  const handleChangeCount = (e, layerIndex, imageIndex) => {
    const { value } = e.target;

    const payload = {
      layerIndex,
      imageIndex,
      value: value,
      isRarityInput: true,
    };
    
    // @ts-ignore
    dispatch(checkTraitValid(payload));
    

    if(value == '') {
      setIsOnBlur(false)
      setImageIndex(imageIndex)
    }
  };

  const handleChangeLayerName = (e, index) => {
    const { value } = e.target;

    dispatch(updateLayerName({ key: "name", value: value, index: index }));
  };

  const handleChangeImageName = (e, layerIndex, imageIndex) => {
    dispatch(
      updateImageName({
        value: e.target.value,
        layerIndex,
        imageIndex,
      })
    );
  };


  if(!layers.some((item) => item?.images?.length > 0)) {
    return <EmptyPage textStatus="Please add the layers and upload your images."/>
  }


  return layers.map((item, index) => {
    // const totalCount = sumBy(item.images, (item) => {
    //   return item.count || 0;
    // }); 
    const totalRarity = sumBy(item.images, (item) => {
      return item.rarity || 0;
    });    

    return (
      <div className="wrap-rarity" key={index}>
        <div className="rarity-header">
          <div className="header-name-input">
            {/* <p className="title">{item.traitTitle}</p> */}
            <input
              className="layer-name"
              type={"text"}
              value={item.name}
              onChange={(e) => handleChangeLayerName(e, index)}
            />

            <div className="header-count">
              <p>Count</p>
              <input
                disabled={true}
                value={totalSupply}
                className="input-count-header"
              />
            </div>
          </div>

          {!item.isValid ? (
            <AlertMessage totalSupply={totalSupply} total={totalRarity} />
          ) : null}
        </div>

        <div className="rarity-table">
          <table>
            <thead>
              <tr>
                <th>Variation</th>
                <th>Rarity</th>
                {/* <th>Count</th> */}
              </tr>
            </thead>

            <tbody>
              {item.images.map((value, idx) => {
                let imgItem = ''
                if (value?.image) {
                  imgItem = value.image
                } else if (value?.path) {
                  imgItem = host.baseImg + value.path
                }

                let rarityValue = value.rarity
                if(imageIndex == idx && value.rarity == 0) {
                  rarityValue = ''
                }

                if(imageIndex == idx && isOnBlur && value.rarity == 0 ) {
                  rarityValue = 0
                }


                return (

                  <tr key={idx}>
                    <td>
                      <div className="variation">
                        <img src={imgItem} />

                        <div className="variation-group">
                          <p className="image-name">{`${value.name}`}</p>
                          <input
                            className="input-edit-name"
                            name={value.title}
                            value={value.title}
                            onChange={(e) => handleChangeImageName(e, index, idx)}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        ref={(ref) => (inputRef[idx] = ref)}
                        type="number"
                        value={rarityValue}
                        // placeholder={'0'}
                        onChange={(e) => handleChangeCount(e, index, idx)} // idx is trait detail position: ;
                        className="input-count"
                        onBlur={(e) => setIsOnBlur(true)}
                      />
                      <span className="percentage"> %</span>
                    </td>
                    {/* <td>{`${value.count}`}</td> */}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  });
};

export default Rarity;
