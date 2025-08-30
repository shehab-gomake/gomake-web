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
        // Determine side strictly from the parameter being edited (not from existence of Side2 in template)
        const currentParamCode: string = settingParameters?.parameter?.code;
        const isSide2 = typeof currentParamCode === "string" && currentParamCode.toLowerCase().includes("side2");
        const colorParamCode = isSide2 ? "printingcolorsDetailSide2" : "printingcolorsDetail";
        const loadParamCode = isSide2 ? "ColorloadpercentageSide2" : "Colorloadpercentage";
        const avgParamCode = isSide2 ? "ColorsLoadAverageSide2" : "ColorsLoadAverage";

        // Fallback ids (used in some templates)
        const COLOR_PARAM_IDS = [
          "8eff3238-a321-48f3-85eb-c14afaccbff3",
          "ae8d81d1-a0de-4967-b821-dae6937e7551",
        ];
        const LOAD_PARAM_IDS = ["8b43efba-f28c-4e73-8fa0-cc64f3ea06f8"];

        const sectionId = settingParameters?.section?.id;
        const subSectionId = settingParameters?.subSection?.id;
        const actionIndex = settingParameters?.parameter?.actionIndex;

        // Strictly resolve color and load parameters for the same side, section, subSection and actionIndex
        let colorParamVal = target.parameters.find(
          (p: any) =>
            p.parameterCode === colorParamCode &&
            p.sectionId === sectionId &&
            p.subSectionId === subSectionId &&
            (typeof actionIndex === "number" ? p.actionIndex === actionIndex : true)
        );
        if (!colorParamVal) {
          colorParamVal = target.parameters.find(
            (p: any) =>
              COLOR_PARAM_IDS.includes(p.parameterId) &&
              p.sectionId === sectionId &&
              p.subSectionId === subSectionId &&
              (typeof actionIndex === "number" ? p.actionIndex === actionIndex : true)
          );
        }

        let loadParamVal = target.parameters.find(
          (p: any) =>
            p.parameterCode === loadParamCode &&
            p.sectionId === sectionId &&
            p.subSectionId === subSectionId &&
            (typeof actionIndex === "number" ? p.actionIndex === actionIndex : true)
        );
        if (!loadParamVal) {
          loadParamVal = target.parameters.find(
            (p: any) =>
              LOAD_PARAM_IDS.includes(p.parameterId) &&
              p.sectionId === sectionId &&
              p.subSectionId === subSectionId &&
              (typeof actionIndex === "number" ? p.actionIndex === actionIndex : true)
          );
        }
        // Find exact avg parameter instance for this subSection/section
        let avgParamIdx = target.parameters.findIndex(
          (p: any) =>
            p.parameterCode === avgParamCode &&
            p.sectionId === settingParameters?.section?.id &&
            p.subSectionId === settingParameters?.subSection?.id
        );
        if (avgParamIdx === -1) {
          const avgDef = (settingParameters?.list || []).find((p: any) => p.code === avgParamCode);
          if (avgDef) {
            avgParamIdx = target.parameters.findIndex(
              (p: any) =>
                p.parameterId === avgDef.id &&
                p.sectionId === settingParameters?.section?.id &&
                p.subSectionId === settingParameters?.subSection?.id &&
                (typeof avgDef.actionIndex === "number" ? p.actionIndex === avgDef.actionIndex : true)
            );
          }
        }

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
