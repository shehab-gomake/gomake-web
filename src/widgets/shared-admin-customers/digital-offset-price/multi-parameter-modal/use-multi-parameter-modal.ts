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

const useMultiParameterModal = ({ settingParameters, onClose,isParameterSettings ,getProductById,setCanCalculation}) => {
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
          foundParameter = subProduct?.parameters?.find(
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
    setCanCalculation(true)
    let copy = lodashClonedeep(subProductsCopy);

    // Compute average load of selected colors and update average parameter
    try {
      const subSectionType = settingParameters?.subSection?.type;
      const target = copy?.find((sp: any) => sp?.type === subSectionType);
      if (target && Array.isArray(target.parameters)) {
        // Detect which side this modal controls by checking which params exist
        const hasSide2 = !!target.parameters.find((p: any) => p.parameterCode === "printingcolorsDetailSide2");
        const colorParamCode = hasSide2 ? "printingcolorsDetailSide2" : "printingcolorsDetail";
        const loadParamCode = hasSide2 ? "ColorloadpercentageSide2" : "Colorloadpercentage";
        const avgParamCode = hasSide2 ? "ColorsLoadAverageSide2" : "ColorsLoadAverage";

        const colorParamVal = target.parameters.find((p: any) => p.parameterCode === colorParamCode);
        const loadParamVal = target.parameters.find((p: any) => p.parameterCode === loadParamCode);
        const avgParamIdx = target.parameters.findIndex((p: any) => p.parameterCode === avgParamCode);

        if (colorParamVal && loadParamVal && Array.isArray(colorParamVal.valueIds) && Array.isArray(loadParamVal.values)) {
          // Average only selected colors' loads
          const selectedCount = colorParamVal.valueIds.length;
          const selectedLoads = loadParamVal.values.slice(0, selectedCount).map((v: any) => Number(v)).filter((n: any) => !isNaN(n));
          if (selectedLoads.length > 0) {
            const sum = selectedLoads.reduce((acc: number, n: number) => acc + n, 0);
            const avg = Math.round(sum / selectedLoads.length);
            if (avgParamIdx !== -1) {
              target.parameters[avgParamIdx] = {
                ...target.parameters[avgParamIdx],
                values: [avg.toString()],
                valueIds: [avg.toString()],
              };
            }
          }
        }
      }
    } catch (err) {
      // ignore averaging failure - do not block save
    }

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
    // Before persisting, compute the average from default arrays and update the average parameter's defaultValue
    try {
      const settingParams = data?.settingParameters || [];
      const hasSide2 = !!settingParams.find((p: any) => p.code === "printingcolorsDetailSide2");
      const colorParam = settingParams.find((p: any) => p.code === (hasSide2 ? "printingcolorsDetailSide2" : "printingcolorsDetail"));
      const loadParam = settingParams.find((p: any) => p.code === (hasSide2 ? "ColorloadpercentageSide2" : "Colorloadpercentage"));
      const avgParamIdx = settingParams.findIndex((p: any) => p.code === (hasSide2 ? "ColorsLoadAverageSide2" : "ColorsLoadAverage"));
      if (colorParam && loadParam && avgParamIdx !== -1) {
        const selectedIds = colorParam?.defaultValueArray || [];
        const loads = (loadParam?.defaultValueArray || []).slice(0, selectedIds.length).map((n: any) => Number(n)).filter((n: any) => !isNaN(n));
        if (loads.length > 0) {
          const sum = loads.reduce((a: number, b: number) => a + b, 0);
          const avg = Math.round(sum / loads.length);
          data.settingParameters[avgParamIdx] = {
            ...data.settingParameters[avgParamIdx],
            defaultValue: avg,
          };
        }
      }
    } catch {}

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
