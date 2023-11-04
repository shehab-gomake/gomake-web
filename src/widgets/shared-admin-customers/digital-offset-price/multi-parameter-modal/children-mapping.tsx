import { useRecoilState, useRecoilValue } from "recoil";
import { ChildrenValuesMapping } from "./children-values-mapping";
import { materialsState } from "@/store";
import { compareStrings } from "@/utils/constants";
import { useEffect } from "react";
import { maltiParameterState } from "./store/multi-param-atom";

const ChildrenMapping = ({
  parameters,
  item,
  index,
  clasess,
  settingParameters,
  selectedValueConfig,
}) => {
  console.log("selectedValueConfig", selectedValueConfig);

  const allMaterials = useRecoilValue<any>(materialsState);
  const [generalParameters, setGeneralParameters] =
    useRecoilState(maltiParameterState);
  const foundMaterial = allMaterials.find((material) => {
    return parameters.some(
      (parameter) =>
        parameter.parameterType === 5 &&
        compareStrings(parameter.materialPath[0], material.pathName)
    );
  });
  useEffect(() => {
    if (generalParameters?.length == 0) {
      const temp = parameters.map((item: any) => ({
        parameterId: item.id,
        sectionId: settingParameters?.section?.id,
        subSectionId: settingParameters?.subSection?.id,
        parameterType: item.parameterType,
        parameterName: item.name,
        actionId: item.actionId,
        valueId: [],
        value: [],
      }));
      setGeneralParameters(temp);
    }
  }, [settingParameters]);
  return (
    <div
      style={{
        minWidth: index == 0 ? "50%" : "25%",
        maxWidth: index == 0 ? "50%" : "25%",
        textAlign: "left",
      }}
    >
      {generalParameters?.length &&
        foundMaterial?.data.map((value, index2) => (
          <ChildrenValuesMapping
            parameters={parameters}
            item={item}
            value={value}
            clasess={clasess}
            index={index}
            index2={index2}
            key={`abc_${index}_${index2}`}
            selectedValueConfig={selectedValueConfig}
          />
        ))}
    </div>
  );
};
export { ChildrenMapping };
