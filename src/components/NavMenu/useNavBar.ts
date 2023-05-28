import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

export const useNavBar = () => {
  const dispatch = useDispatch();

  const { setting } = useSelector((state: any) => state);
  const { projectInfo } = setting;

 

  return {
  
  };
};
