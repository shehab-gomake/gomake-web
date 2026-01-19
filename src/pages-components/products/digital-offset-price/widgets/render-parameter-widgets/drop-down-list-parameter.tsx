import { GoMakeAutoComplate } from "@/components";
import { SettingsIcon } from "@/icons/settings";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { EParameterTypes } from "@/enums";
import { IconButton, Popper } from "@mui/material";
import { GoToMaterialsIcon } from "@/icons";
import { useTranslation } from "react-i18next";

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
  if (label && label.length > 50) {
    let shortLabel = label.substring(0, 50);
    let lastSpace = shortLabel.lastIndexOf(" ");
    shortLabel = shortLabel.substring(0, lastSpace) + "...";
    return (
      <CustomWidthTooltip
        title={label}
        placement="right"
        arrow
        style={{ maxWidth: 500 }}
      >
        <span>{shortLabel}</span>
      </CustomWidthTooltip>
    );
  }
  return label;
};

const StyledPopper = styled(Popper)(({ theme }) => ({
  // zIndex: 10000000, // Higher than modal z-index (9999999)
  "&[data-popper-placement]": {
    width: "150%",
  },
  "& .MuiAutocomplete-paper": {
    width: "150%",
    minWidth: "150%",
  },
  "& .MuiAutocomplete-listbox": {
    width: "150%",
  },
}));

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
  multiParameterModal,
}: any) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(
    index !== -1
      ? { updateName: temp[index].values }
      : parameter.valuesConfigs.find((item) => item.isDefault)
  );

  useEffect(() => {
    setSelectedValue(
      (index !== -1 && temp[index]?.values) ? { updateName: temp[index].values } : undefined
    );
  }, [parameter, index,]);

  useEffect(() => {
    if (parameter?.parameterType === EParameterTypes.MACHINES_SELECT || (parameter?.code === "devicesize" || parameter?.code === "devicecategory")) {
      setSelectedValue(
        (index !== -1 && temp[index]?.values) ? { updateName: temp[index].values } : parameter.valuesConfigs.find((item) => item.isDefault)
      );
    }
  }, [parameter, index,]);
  useEffect(() => {
    if (parameter?.code === "devicesize" && parameter?.valuesConfigs?.length === 1 && parameter?.isRequired) {
      setDeviceSize(selectedValue?.updateName[0]);
    }
  }, [selectedValue])
  const handleValueChange = (e, value) => {
    setSelectedValue(value); // Update the selected value in state
    // Handle category or size changes
    if (parameter?.code === "devicecategory") {
      setDeviceCategory(value?.id);
    } else if (parameter?.code === "devicesize") {
      setDeviceSize(value?.id);
    }
    let valueId = null;
    if (parameter?.parameterType == EParameterTypes.MACHINES_SELECT) {
      valueId = value?.updateName;
    } else {
      valueId = value?.id;
    }
    // Update the subProducts for pricing
    onChangeSubProductsForPrice(
      parameter?.id,
      subSection?.id,
      section?.id,
      parameter?.parameterType,
      parameter?.name,
      parameter?.actionId,
      value
        ? { valueIds: valueId, values: value?.updateName }
        : { valueIds: null, values: null }, // Handle cleared state
      subSection?.type,
      index,
      parameter?.actionIndex,
      parameter?.code
    );
  };
  const myParameter = temp.find((item) => item.parameterId === parameter.id && item?.actionIndex === parameter.actionIndex)
  return (
    <div
      data-tour={parameter?.id}
      style={
        parameter?.setSettingIcon && inModal
          ? { ...clasess.dropDownListWithSettingIcon, }
          : clasess.dropDownListWithSettingIcon
      }
    >
      <GoMakeAutoComplate
        disabled={parameter?.isLock ?? myParameter?.isDisabled}
        key={
          parameter?.parameterType === EParameterTypes.MACHINES_SELECT ?
            selectedValue :
            index !== -1 && temp[index]?.values ? selectedValue
              : undefined}
        options={parameter?.valuesConfigs
          ?.filter((value) => {
            return !(
              value?.materialValueIds?.length === 1 &&
              value?.materialValueIds[0]?.path === null &&
              value?.materialValueIds[0]?.valueId === null
            );
          })
          ?.filter((value) => !value.isHidden)
          ?.filter((value) => value.updateName)}
        placeholder={parameter.name}
        style={
          parameter?.isRequired && !selectedValue?.updateName
            ? clasess.requiredDropDownListStyle
            : clasess.dropDownListStyle
        }
        getOptionLabel={(option) => option.updateName}
        value={selectedValue} // Controlled value, reflecting the current state
        onChange={handleValueChange}
        PopperComponent={StyledPopper}
        disablePortal={false}
        renderOption={(props, option) => (
          <li {...props}>{getLabelWithTooltip(option.updateName)}</li>
        )}
      />
      {parameter?.parameterType ===
        EParameterTypes.ADVERTISING_PRODUCT_CATEGORY && (
          <div>
            <Tooltip title={t("tabs.materials")}>
              <IconButton
                onClick={() => {
                  window.open(
                    `/materials/${parameter?.materialPath[0]}?materialCategory=${temp[index]?.valueIds[0]}`,
                    "_blank"
                  );
                }}
              >
                <GoToMaterialsIcon />
              </IconButton>
            </Tooltip>
          </div>
        )}
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
            stroke={"var(--theme-accent-color, var(--theme-secondary-color, #ED028C))"}
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
};

export { DropDownListParameterWidget };
