import { useRecoilValue } from "recoil";
import { ChildrenValuesMapping } from "./children-values-mapping";
import { materialsState } from "@/store";
import { compareStrings } from "@/utils/constants";
import { useEffect, useState } from "react";

const ChildrenMapping = ({
  parameters,
  item,
  index,
  clasess,
  settingParameters,
}) => {
  const allMaterials = useRecoilValue<any>(materialsState);
  const [generalParameters, setGeneralParameters] = useState([]);

  useEffect(() => {
    console.log("IAM HEREEEE");
    const temp = parameters.map((item) => ({
      parameterId: item.id,
      sectionId: settingParameters?.section?.id,
      subSectionId: settingParameters?.subSection?.id,
      parameterType: item.parameterType,
      parameterName: item.name,
      actionId: item.actionId,
      valueId: [],
      value: [],
    }));
    console.log("IAM HEREEEE2", temp);
    setGeneralParameters(temp);
  }, [settingParameters]);
  const foundMaterial = allMaterials.find((material) => {
    return parameters.some(
      (parameter) =>
        parameter.parameterType === 5 &&
        compareStrings(parameter.materialPath[0], material.pathName)
    );
  });
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
            generalParameters={generalParameters}
          />
        ))}
    </div>
  );
};
export { ChildrenMapping };
