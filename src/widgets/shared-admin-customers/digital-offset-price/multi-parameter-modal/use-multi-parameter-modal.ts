import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

import {
  generalParametersState,
  selectedValueConfigState,
  subProductsCopyParametersState,
  subProductsParametersState
} from "@/store";

import { selectColorValueState } from "./store/selecte-color-value";
import { useTranslation } from "react-i18next";
import lodashClonedeep from "lodash.clonedeep";

const useMultiParameterModal = ({ settingParameters, onClose,isParameterSettings }) => {
  const [generalParameters, setGeneralParameters] = useRecoilState<any>(
    generalParametersState
  );
  const subProductsParameters = useRecoilValue(subProductsParametersState);

  const { t } = useTranslation();
  const parameterLists = settingParameters?.parameter?.settingParameters;
  const selectedValueConfig = useRecoilValue(selectedValueConfigState);
  const setSelectColorValue = useSetRecoilState(selectColorValueState);
  const [subProducts, setSubProducts] = useRecoilState<any>(subProductsParametersState);
  const [subProductsCopy, setSubProductsCopy] = useRecoilState<any>(subProductsCopyParametersState);


  const getObjectById = () => {
    for (const config of selectedValueConfig) {
      let foundParameter = generalParameters.find(
        (param) => param && param.valueIds && param.valueIds[0] === config.id
      );
      if(!foundParameter){
        const subProduct = subProductsParameters.find(subProduct => settingParameters.section && subProduct.sectionId === settingParameters.section.id );
        if(subProduct && subProduct.parameters && subProduct.parameters.length > 0){
          foundParameter = subProduct.parameters.find(
              (param) => param && param.valueIds && param.valueIds[0] === config.id
          );
        }
      }
      if (foundParameter) {
        return config;
      }
    }
  };
  useEffect(() => {
    const result = getObjectById();
    setSelectColorValue(result);
  }, [generalParameters, selectedValueConfig]);

  const onClickSaveParameter = () => {
    if(isParameterSettings){

    }
    else{
      let copy = lodashClonedeep(subProductsCopy);
    setSubProducts(copy)
    }
    onClose();

    
  };
  const closeModal = () => {
    let copy = lodashClonedeep(subProducts);
    setSubProductsCopy(copy)
    onClose();
  }
  return {
    parameterLists,
    onClickSaveParameter,
    closeModal,
    t,
  };
};

export { useMultiParameterModal };
