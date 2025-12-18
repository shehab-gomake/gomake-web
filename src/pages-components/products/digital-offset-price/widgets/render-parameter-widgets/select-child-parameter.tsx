import { GoMakeAutoComplate } from "@/components";
import { useEffect, useState } from "react";
import { EParameterTypes } from "@/enums";
import { Popper, styled } from "@mui/material";

const SelectChildParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
  disabled,
  multiParameterModal
}) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );

  const [selectedValue, setSelectedValue] = useState(
    index !== -1
      ? { updateName: temp[index].values }
      : defaultObject
  );

  useEffect(() => {
    setSelectedValue(
      (index !== -1 && temp[index]?.values) ? { updateName: temp[index].values } : undefined
    );
  }, [parameter, index, defaultObject]);

  const handleValueChange = (e, value) => {
    setSelectedValue(value); // Update the selected value in state

    // Update the subProducts for pricing
    onChangeSubProductsForPrice(
      parameter?.id,
      subSection?.id,
      section?.id,
      parameter?.parameterType,
      parameter?.name,
      parameter?.actionId,
      value
        ? { valueIds: value?.id, values: value?.updateName, value }
        : { valueIds: null, values: null }, // Handle cleared state
      subSection?.type,
      index,
      parameter?.actionIndex,
      parameter?.code
    );
  };

  const myParameter = temp.find((item) => item.parameterId === parameter.id && item?.actionIndex === parameter.actionIndex);

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

  return (
    <div data-tour={parameter?.id} style={{ width: '100%' }}>
      {parameter?.valuesConfigs?.length > 0 && (
        <GoMakeAutoComplate
          data-tour={parameter?.id}
          options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
          placeholder={parameter.name}
          key={
            parameter?.parameterType === EParameterTypes.SELECT_CHILDS_PARAMETERS ?
              selectedValue :
              index !== -1 && temp[index]?.values ? selectedValue
                : undefined}
          style={parameter?.isRequired && !selectedValue?.updateName ? clasess.requiredDropDownListStyle : clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          value={selectedValue} // Controlled value, reflecting the current state
          disabled={disabled || (parameter?.isLock ?? myParameter?.isDisabled)}
          onChange={handleValueChange}
          PopperComponent={StyledPopper}
          disablePortal={false}
        />
      )}
    </div>
  );
};

export { SelectChildParameterWidget };
