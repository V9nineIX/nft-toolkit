import React, { useEffect } from "react";
import "./preview.scss";
import { usePreview } from "../../hooks/usePreview";
import EmptyPage from '../EmptyPage'
import { checkUploadImageLayer } from '../../utils/index'
 
const Preview = () => {
  const { handlePreview, collectionPreview, layers } = usePreview();

  useEffect(() => {
    if(checkUploadImageLayer(layers)) {
      handlePreview();
    }
  }, [layers]);
  
  if(!checkUploadImageLayer(layers)) {
    return <EmptyPage textStatus="Please add the layers and upload your images."/>
  } 

  return (
    <div className="wrap-preview">
      {collectionPreview == null ? null : (
        <img src={collectionPreview} width={400} height={400} />
      )}
    
      {/* <Button size="lg" variant="outlined" onClick={() => handlePreview()}>
        Preview 
      </Button> */}
      
    </div>
  );
};

export default Preview;
