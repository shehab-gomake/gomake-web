import { materialsState } from "@/store";
import { useRecoilState, useRecoilValue } from "recoil";
import { maltiParameterState } from "./store/multi-param-atom";
import { compareStrings } from "@/utils/constants";
import { useEffect, useMemo } from "react";

const useChildMapping = ({ parameters, settingParameters }) => {
  const allMaterials = useRecoilValue<any>(materialsState);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const foundMaterial = useMemo(() => {
    debugger;
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
  return { generalParameters, foundMaterial };
};

export { useChildMapping };
