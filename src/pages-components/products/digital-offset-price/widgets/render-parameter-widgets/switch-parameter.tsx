import { SecondSwitch } from "@/components";

const SWITCHParameterWidget = ({
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
}) => {
  return (
    <SecondSwitch
      defaultChecked={parameter?.defaultValue === "true"}
      checked={
        index !== -1 ? (temp[index].values[0] === "true" ? true : false) : ""
      }
      disabled={parameter?.isLock ? parameter?.isLock : false}
      onChange={(e: any, value: any) => {
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
          parameter?.actionIndex,
          parameter?.code
        );
      }}
    />
  );
};

export { SWITCHParameterWidget };
