import { ChildrenValuesMapping } from "./children-values-mapping";
import { useChildMapping } from "./use-children-mapping-modal";

const ChildrenMapping = ({
  parameters,
  item,
  index,
  clasess,
  settingParameters,
  isParameterSettings,
  setSettingParameters
}: any) => {
  const { generalParameters, foundMaterial, updatedParameters } = useChildMapping({
    parameters,
    settingParameters,
    setSettingParameters
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
            parameters={updatedParameters}
            item={item}
            value={value}
            clasess={clasess}
            index={index}
            index2={index2}
            key={`abc_${index}_${index2}`}
            settingParameters={settingParameters}
            isParameterSettings={isParameterSettings}
            setSettingParameters={setSettingParameters}
          />
        ))}
    </div>
  );
};
export { ChildrenMapping };
