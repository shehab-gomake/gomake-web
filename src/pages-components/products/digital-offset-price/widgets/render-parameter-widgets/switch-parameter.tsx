import { SecondSwitch } from "@/components";

const SWITCHParameterWidget = ({
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  onChangeForPrice,
  subSection,
  section,
}) => {
  return (
    <SecondSwitch
      defaultChecked={parameter?.defaultValue === "true"}
      checked={
        index !== -1 ? (temp[index].values[0] === "true" ? true : false) : ""
      }
      onChange={(e: any, value: any) => {
        if (subSection?.type) {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { values: value?.toString() },
            subSection?.type,
            index,
            parameter?.actionIndex
          );
        } else {
          onChangeForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { values: value?.toString() },
            index,
            parameter?.actionIndex
          );
        }
      }}
    />
  );
};

export { SWITCHParameterWidget };
