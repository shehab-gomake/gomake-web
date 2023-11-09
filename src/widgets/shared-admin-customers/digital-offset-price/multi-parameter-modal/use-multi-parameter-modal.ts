import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { selectedValueConfigState } from "@/store";

import { selectColorValueState } from "./store/selecte-color-value";
import { useTranslation } from "react-i18next";
import { useChildMapping } from "./use-children-mapping-modal";
import { maltiParameterState } from "./store/multi-param-atom";
import lodashClonedeep from "lodash.clonedeep";

const useMultiParameterModal = ({
  settingParameters,
  generalParameters,
  setGeneralParameters,
  onClose,
}) => {
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
      const foundParameter = generalParameters.find(
        (param) => param && param.valueIds && param.valueIds[0] === config.id
      );
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
                temp[i].values.push(parseFloat(propertyValue?.value));
              }
            }
          }
        }
      }
    }
    temp.forEach((tempObject) => {
      const index = generalParameters.findIndex(
        (param) => param.parameterId === tempObject.parameterId
      );
      if (index !== -1) {
        generalParameters[index] = tempObject;
      } else {
        generalParameters.push(tempObject);
      }
    });
    setGeneralParameters(generalParameters);
    onClose();
  };
  return {
    parameterLists,
    onClickSaveParameter,
    t,
  };
};

export { useMultiParameterModal };
