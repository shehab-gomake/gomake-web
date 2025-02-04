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
  return (
    <div data-tour={parameter?.id?.toString()}>
      <GomakeTextInput
        //key={disabled + "parameter" + index}
        style={clasess.textInputStyle}
        disabled={disabled}
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
      />
    </div>
  );
};

export { InputNumberParameterWidget };
