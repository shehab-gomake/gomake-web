import { GoMakeAutoComplate } from "@/components";

const SelectChildParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  disabled
}) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );

  return (
    <div data-tour={parameter?.id} style={{ width: '100%' }}>
      {parameter?.valuesConfigs?.length > 0 && (
        <GoMakeAutoComplate
          data-tour={parameter?.id}
          options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
          placeholder={parameter.name}
          key={parameter.id + "-" + parameter.actionIndex}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={
            index !== -1 ? { updateName: temp[index].values } : defaultObject
          }
          disabled={disabled}
          onChange={(e: any, value: any) => {
            onChangeSubProductsForPrice(
              parameter?.id,
              subSection?.id,
              section?.id,
              parameter?.parameterType,
              parameter?.name,
              parameter?.actionId,
              { valueIds: value?.id, values: value?.updateName, value },
              subSection?.type,
              index,
              parameter?.actionIndex,
              parameter?.code
            );
          }}
        />
      )}
    </div>
  );
};

export { SelectChildParameterWidget };
