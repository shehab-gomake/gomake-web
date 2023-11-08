import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { selectedValueConfigState } from "@/store";

import { selectColorValueState } from "./store/selecte-color-value";
import { useTranslation } from "react-i18next";

const useMultiParameterModal = ({
  settingParameters,
  generalParameters,
  onClose,
}) => {
  const { t } = useTranslation();
  const parameterLists = settingParameters?.parameter?.settingParameters;
  const selectedValueConfig = useRecoilValue(selectedValueConfigState);
  const setSelectColorValue = useSetRecoilState(selectColorValueState);
  function getObjectById() {
    for (const config of selectedValueConfig) {
      const foundParameter = generalParameters.find(
        (param) => param && param.valueIds && param.valueIds[0] === config.id
      );
      if (foundParameter) {
        return config;
      }
    }
  }
  useEffect(() => {
    const result = getObjectById();
    setSelectColorValue(result);
  }, [generalParameters, selectedValueConfig]);

  const onClickSaveParameter = () => {
    console.log("GGGG");
    // onClose();
  };
  return {
    parameterLists,
    onClickSaveParameter,
    t,
  };
};

export { useMultiParameterModal };
