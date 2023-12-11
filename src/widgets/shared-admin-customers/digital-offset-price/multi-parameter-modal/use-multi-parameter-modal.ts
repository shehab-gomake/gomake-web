import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

import {generalParametersState, selectedValueConfigState, subProductsParametersState} from "@/store";

import { selectColorValueState } from "./store/selecte-color-value";
import { useTranslation } from "react-i18next";
import { useChildMapping } from "./use-children-mapping-modal";
import { maltiParameterState } from "./store/multi-param-atom";
import lodashClonedeep from "lodash.clonedeep";

const useMultiParameterModal = ({ settingParameters, onClose }) => {
  const [generalParameters, setGeneralParameters] = useRecoilState<any>(
    generalParametersState
  );
  const subProductsParameters = useRecoilValue(subProductsParametersState);

  const { t } = useTranslation();
  const generalParametersLocal = useRecoilValue(maltiParameterState);
  const parameterLists = settingParameters?.parameter?.settingParameters;
  const selectedValueConfig = useRecoilValue(selectedValueConfigState);
  const setSelectColorValue = useSetRecoilState(selectColorValueState);
  const { foundMaterial } = useChildMapping({
    parameters: parameterLists,
    settingParameters,
  });

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
    let temp = lodashClonedeep(generalParametersLocal);
    let temp1 = lodashClonedeep(generalParameters);
    const numProperties = temp.length;
    temp[0].values = [];
    temp[0].valueIds = [];
    for (let index = 0; index < 1; index++) {
      for (let index2 = 0; index2 < foundMaterial.data.length; index2++) {
        for (
          let index3 = 0;
          index3 < foundMaterial.data[index2].data.length;
          index3++
        ) {
          const isChecked = (
            document.getElementById(
              `check_${index}_${index2}_${index3}`
            ) as HTMLInputElement
          )?.value;

          if (isChecked === "true") {
            temp[0].values.push(foundMaterial.data[index2].data[index3].value);
            temp[0].valueIds.push(
              foundMaterial.data[index2].data[index3].valueId
            );

            for (let i = 1; i < numProperties; i++) {
              const propertyValue: any = document.getElementById(
                `input_${i}_${index2}_${index3}`
              );

              if (propertyValue) {
                temp[i].values.push(propertyValue?.value);
              }
            }
          }
        }
      }
    }
    temp.forEach((tempObject) => {
      const index = temp1.findIndex(
        (param) => param.parameterId === tempObject.parameterId
      );
      if (index !== -1) {
        temp1[index] = tempObject;
      } else {
        temp1.push(tempObject);
      }
    });
    setGeneralParameters(temp1);
    onClose();
  };
  return {
    parameterLists,
    onClickSaveParameter,
    t,
  };
};

export { useMultiParameterModal };
