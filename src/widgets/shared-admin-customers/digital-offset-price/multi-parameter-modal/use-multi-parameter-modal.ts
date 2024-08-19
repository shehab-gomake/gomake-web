import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback, useEffect } from "react";

import {
  generalParametersState,
  selectedValueConfigState,
  subProductsCopyParametersState,
  subProductsParametersState
} from "@/store";

import { selectColorValueState } from "./store/selecte-color-value";
import { useTranslation } from "react-i18next";
import lodashClonedeep from "lodash.clonedeep";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";

const useMultiParameterModal = ({ settingParameters, onClose,isParameterSettings ,getProductById}) => {
  const [generalParameters, setGeneralParameters] = useRecoilState<any>(
    generalParametersState
  );
  const subProductsParameters = useRecoilValue(subProductsParametersState);
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded } = useSnackBar();
  const router = useRouter();
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
  }, [generalParameters, selectedValueConfig,subProducts]);

  const onClickSaveParameter = () => {
    let copy = lodashClonedeep(subProductsCopy);
    setSubProducts(copy)
    setSubProductsCopy(copy)
    onClose();

    
  };
  const updatedValuesConfigsForParameters = useCallback(
    async (sectionId: string, subSectionId: string, data: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.id,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: data,
        }
      );
      if (res?.success) {
        alertSuccessAdded()
      } else {
        alertFaultAdded()
      }
    },
    [router]
  );

  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, data: any) => {
        await updatedValuesConfigsForParameters(sectionId,subSectionId,data);
    },

    [router]
  );
  const onClickSaveParameterForSettings = (sectionId,subSectionId,data) => {
    updatedProductParameteDefaultValue(sectionId,subSectionId,data)
    getProductById()
    onClose();

    
  };
  const closeModal = () => {
   
    onClose();
  }
  return {
    parameterLists,
    onClickSaveParameter,
    closeModal,
    onClickSaveParameterForSettings,
    t,
  };
};

export { useMultiParameterModal };
