import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";

import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { MinusIcon } from "./icons/minus";
import { PlusIcon } from "./icons/plus";
import { useChildValuesMapping } from "./use-child-values-modal";

const ChildrenValuesMapping = ({
  parameters,
  item,
  value,
  clasess,
  index,
  index2,
  settingParameters,
}) => {
  const {
    selectColorValue,
    checked,
    ref,
    isFocused,
    valueState,
    forceChange,
    paddingLeft,
    parentValue,
    onChangeCheckBox,
    onChangeText,
    incrementValue,
    decrementValue,
    isDisabled,
    setIsFocused,
    isChecked,

  } = useChildValuesMapping({ value, index, parameters, settingParameters, item });
  return (
    <>
      {value?.valueId?.length != 0 && (
        <div style={clasess.childRowContainer}>
          {item?.name === parameters[0].name && (
            <div style={{ paddingLeft: 13 }}>
              <Checkbox
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxCheckedIcon />}
                onChange={(e) => onChangeCheckBox(e)}
                // id={`c${index}_${index2}`}
                key={`c${index}_${selectColorValue}`}
                checked={isChecked}
                value={isChecked}
                disabled={isDisabled}
              />
            </div>
          )}
          <div style={clasess.childLabelStyle}>
            {item?.parameterType != 1 ? (
              value?.value
            ) : (
              <div ref={ref as React.RefObject<HTMLDivElement>}>
                <GomakeTextInput
                  id={`p${index}_${index2}`}
                  placeholder={value?.value}
                  defaultValue={value?.value}
                  style={{
                    ...clasess.textInputStyle,
                    border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
                  }}
                  onFocus={() => setIsFocused(true)}
                  value={valueState}
                  onChange={onChangeText}
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
      )}

      {value?.data?.length > 0 && (
        <div>
          {value?.data?.map((value2, index3) => {
            return (
              <SubChildrenMapping
                key={`subChild_${index3}`}
                parameters={parameters}
                item={item}
                value={value2}
                clasess={clasess}
                index={index}
                index2={index2}
                index3={index3}
                forceChange={forceChange}
                paddingLeft={paddingLeft}
                parentValue={parentValue}
                settingParameters={settingParameters}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export { ChildrenValuesMapping };
