import { GoMakeAutoComplate } from "@/components";
import { SettingsIcon } from "@/icons/settings";

const DropDownListParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  selectedValueConfig,
  inModal,
  setSelectedValueConfig,
  onOpeneMultiParameterModal,
  subSectionParameters,
  list,
}) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  return (
    <div data-tour={parameter?.id} style={clasess.dropDownListWithSettingIcon}>
      <GoMakeAutoComplate
        options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
        key={parameter?.valuesConfigs + temp[index]?.values}
        placeholder={parameter.name}
        style={clasess.dropDownListStyle}
        getOptionLabel={(option: any) => option.updateName}
        defaultValue={
          index !== -1 ? { updateName: temp[index].values } : defaultObject
        }
        onChange={(e: any, value: any) => {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { valueIds: value?.id, values: value?.updateName },
            subSection?.type,
            index,
            parameter?.actionIndex,
            parameter?.code
          );
        }}
      />
      {parameter?.setSettingIcon && inModal && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedValueConfig(parameter?.valuesConfigs);
            onOpeneMultiParameterModal(
              parameter,
              subSection,
              section,
              subSectionParameters,
              list
            );
          }}
        >
          <SettingsIcon
            stroke={"rgba(237, 2, 140, 1)"}
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
};

export { DropDownListParameterWidget };
