import { GomakeTextInput } from "@/components";

const InputNumberParameterWidget = ({
  clasess,
  parameter,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  type,
  disabled = false,
  extraOnChange
}: any) => {
  const myParameter = temp.find((item) => item.parameterId === parameter.id)
  return (
    <div data-tour={parameter?.id?.toString()}>
      <GomakeTextInput
        style={clasess.textInputStyle}
        disabled={parameter?.isLock ? parameter?.isLock : disabled ? disabled : myParameter?.isDisabled}
        defaultValue={parameter.defaultValue}
        placeholder={parameter.name}
        value={index !== -1 ? temp[index].values : ""}
        onChange={(e: any, item: any) => {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { values: e.target.value },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
          extraOnChange && extraOnChange()
        }}
        type={type}
        InputProps={{ inputProps: { min: type === "number" ? 0 : undefined } }}
      />
    </div>
  );
};

export { InputNumberParameterWidget };
