import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";

import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { MinusIcon } from "./icons/minus";
import { PlusIcon } from "./icons/plus";
import { useSubChildMapping } from "./use-sub-children-mapping-modal";
import { useEffect } from "react";

const SubChildrenMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
  index3,
  forceChange,
  paddingLeft,
  parentValue,
  settingParameters,
}) => {
  const {
    ref,
    isFocused,
    onChangeCheckBox,
    isDisabled,
    incrementValue,
    decrementValue,
    setIsFocused,
    onChangeText,
    isChecked,
    textInputValue,
  } = useSubChildMapping({
    forceChange,
    parameters,
    settingParameters,
    value,
    index,
    parentValue,
    item
  });
  return (
    <div style={clasess.childRowContainer}>
      {item?.name === parameters[0].name && (
        <div style={{ paddingLeft: paddingLeft }}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={(e) => onChangeCheckBox(e)}
            checked={isChecked}
            value={isChecked}
            key={`c${index}_${value.value}`}
            disabled={isDisabled}
            id={`check_${index}_${index2}_${index3}`}
          />
        </div>
      )}

      <div style={clasess.childLabelStyle}>

        {item?.parameterType != 1 ? (
          value?.value
        ) : (
          <div ref={ref as React.RefObject<HTMLDivElement>}>
            <GomakeTextInput
              style={{
                ...clasess.textInputStyle,
                border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
              }}
              onFocus={() => setIsFocused(true)}
              onChange={onChangeText}
              value={textInputValue}
              id={`input_${index}_${index2}_${index3}`}
            />
            {isFocused && (
              <div style={clasess.iconsContainer}>
                <div onClick={incrementValue} style={clasess.iconContainer}>
                  <PlusIcon />
                </div>
                <div onClick={decrementValue} style={clasess.iconContainer}>
                  <MinusIcon />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export { SubChildrenMapping };
