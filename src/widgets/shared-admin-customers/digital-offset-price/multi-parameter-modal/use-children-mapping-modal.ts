import { materialsState } from "@/store";
import { useRecoilState, useRecoilValue } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import { compareStrings } from "@/utils/constants";
import { useEffect, useMemo } from "react";

const useChildMapping = ({ parameters, settingParameters,setSettingParameters }) => {
  const allMaterials = useRecoilValue<any>(materialsState);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const foundMaterial = useMemo(() => {
    if (allMaterials.length && parameters?.length)
      return allMaterials?.find((material) => {
        return parameters?.some(
          (parameter) =>
            parameter.parameterType === 5 &&
            compareStrings(parameter.materialPath[0], material.pathName)
        );
      });
  }, [allMaterials, parameters]);
  useEffect(() => {
    if (generalParameters?.length == 0 && parameters?.length) {
      const temp = parameters.map((item: any) => ({
        parameterId: item.id,
        sectionId: settingParameters?.section?.id,
        subSectionId: settingParameters?.subSection?.id,
        parameterType: item.parameterType,
        parameterName: item.name,
        actionId: item.actionId,
        valueIds: [],
        values: [],
      }));
      setGeneralParameters(temp);
    }
  }, [settingParameters]);

  const updateParameters = (foundMaterial, parameters) => {
    const materialData = foundMaterial.data[0].data;
    const materialLength = materialData.length;
    const valueIds = materialData.map(item => item.valueId);
  
    // Detect average load parameters for each side (search in current group first, then entire sub-section list)
    let avgLoadParam = parameters.find(p => p.code === "ColorsLoadAverage");
    let avgLoadParamSide2 = parameters.find(p => p.code === "ColorsLoadAverageSide2");
    if (!avgLoadParam || !avgLoadParamSide2) {
      const allSubSectionParams = (settingParameters as any)?.list || [];
      avgLoadParam = avgLoadParam || allSubSectionParams.find((p: any) => p.code === "ColorsLoadAverage");
      avgLoadParamSide2 = avgLoadParamSide2 || allSubSectionParams.find((p: any) => p.code === "ColorsLoadAverageSide2");
    }
  
    return parameters.map(param => {
      if (param.code === "printingcolorsDetail" || param.code === "printingcolorsDetailSide2") {
        return {
          ...param,
          defaultValueArray: param.defaultValueArray ?? valueIds // Use existing values if not null, otherwise use valueIds
        };
      } else if (param.code === "Colorloadpercentage" || param.code === "ColorLayers" || param.code === "ColorloadpercentageSide2" || param.code === "ColorLayersSide2") {
        // Choose a base default for load from ColorsLoadAverage when available
        const isLoadParam = param.code === "Colorloadpercentage" || param.code === "ColorloadpercentageSide2";
        let baseDefault = param.defaultValue;
        if (isLoadParam) {
          if (param.code === "Colorloadpercentage" && avgLoadParam && typeof avgLoadParam.defaultValue !== "undefined" && avgLoadParam.defaultValue !== null) {
            baseDefault = avgLoadParam.defaultValue;
          } else if (param.code === "ColorloadpercentageSide2" && avgLoadParamSide2 && typeof avgLoadParamSide2.defaultValue !== "undefined" && avgLoadParamSide2.defaultValue !== null) {
            baseDefault = avgLoadParamSide2.defaultValue;
          }
        }
        return {
          ...param,
          defaultValueArray: param.defaultValueArray ?? Array(materialLength).fill(baseDefault) // Use existing values if not null, otherwise initialize with default values
        };
      }
      return param;
    });
  };
  const updatedParameters = updateParameters(foundMaterial, parameters);
  useEffect(()=>{
    if(updatedParameters){
      setSettingParameters(prev => ({
        ...prev,
        parameter: {
          ...prev?.parameter,
          settingParameters: updatedParameters,
          
        }
      }));
    }
  },[])
  return { generalParameters, foundMaterial,updatedParameters };
};

export { useChildMapping };
