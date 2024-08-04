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
  
    return parameters.map(param => {
      if (param.code === "printingcolorsDetail") {
        return {
          ...param,
          defaultValueArray: param.defaultValueArray ?? valueIds // Use existing values if not null, otherwise use valueIds
        };
      } else if (param.code === "Colorloadpercentage" || param.code === "ColorLayers") {
        return {
          ...param,
          defaultValueArray: param.defaultValueArray ?? Array(materialLength).fill(param.defaultValue) // Use existing values if not null, otherwise initialize with default values
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
