import { GoMakeAutoComplate } from "@/components";
import { SettingsIcon } from "@/icons/settings";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

// Custom tooltip component for long text options
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});

// Helper function to handle long text labels and apply tooltips
const getLabelWithTooltip = (label: string) => {
  if (label && label.length > 25) {
    let shortLabel = label.substring(0, 28);
    let lastSpace = shortLabel.lastIndexOf(" ");
    shortLabel = shortLabel.substring(0, lastSpace) + "...";
    return (
      <CustomWidthTooltip title={label} placement="right" arrow style={{ maxWidth: 500 }}>
        <span>{shortLabel}</span>
      </CustomWidthTooltip>
    );
  }
  return label;
};

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
  setDeviceCategory,
  setDeviceSize,
  multiParameterModal
}: any) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  return (

    <div data-tour={parameter?.id} style={clasess.dropDownListWithSettingIcon}>
      <GoMakeAutoComplate
        options={parameter?.valuesConfigs?.filter(value => {
          return !(value?.materialValueIds?.length === 1 && value?.materialValueIds[0]?.path === null && value?.materialValueIds[0]?.valueId === null);
        })?.filter((value) => !value.isHidden)?.filter((value) => value.updateName)}
        key={multiParameterModal && parameter?.code === "PrintingColors" ? parameter?.valuesConfigs + temp[index]?.values : parameter?.valuesConfigs}
        placeholder={parameter.name}
        style={clasess.dropDownListStyle}
        getOptionLabel={(option: any) => option.updateName}
        defaultValue={
          index !== -1 ? { updateName: temp[index].values } : defaultObject
        }
        disabled={parameter?.isLock ? parameter?.isLock : false}
        onChange={(e: any, value: any) => {

          if (parameter?.code === "devicecategory") {
            setDeviceCategory(value?.id)
          }
          else if (parameter?.code === "devicesize") {
            setDeviceSize(value?.id)
          }
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
        renderOption={(props, option) => (
          <li {...props}>
            {getLabelWithTooltip(option.updateName)}
          </li>
        )}
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
