import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";

import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { MinusIcon } from "./icons/minus";
import { PlusIcon } from "./icons/plus";
import { useSubChildMapping } from "./use-sub-children-mapping-modal";

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
    checked,
    selectColorValue,
    ref,
    isFocused,
    valueState,
    onChangeCheckBox,
    isDisabled,
    incrementValue,
    decrementValue,
    setIsFocused,
    onChangeText,
  } = useSubChildMapping({
    forceChange,
    parameters,
    settingParameters,
    value,
    index,
  });
  return (
    <div style={clasess.childRowContainer}>
      {item?.name === parameters[0].name && (
        <div style={{ paddingLeft: paddingLeft }}>
          <Checkbox
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
            onChange={onChangeCheckBox}
            checked={checked}
            value={checked}
            key={`c${index}_${selectColorValue}`}
            disabled={isDisabled() && !checked}
            id={`check_${index}_${index2}_${index3}`}
          />
        </div>
      )}

      <div style={clasess.childLabelStyle}>
        {item?.parameterType != 1 ? (
          value?.value
        ) : (
          <div ref={ref}>
            <GomakeTextInput
              style={{
                ...clasess.textInputStyle,
                border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
              }}
              onFocus={() => setIsFocused(true)}
              onChange={onChangeText}
              value={valueState}
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
