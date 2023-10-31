import { GomakeTextInput } from "@/components";
import { Checkbox } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useState } from "react";
import { PlusIcon } from "./icons/plus";
import { MinusIcon } from "./icons/minus";
import { useClickAway } from "@uidotdev/usehooks";

const ChildrenValuesMapping = ({ paameters, item, value, clasess }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [valueState, setValueState] = useState(0);
  const incrementValue = () => {
    setIsFocused(true);
    setValueState(valueState + 1);
  };

  const decrementValue = () => {
    setValueState(valueState - 1);
  };
  const ref = useClickAway(() => {
    setIsFocused(false);
  });
  return (
    <>
      <div style={clasess.childRowContainer}>
        {item?.parameterName === paameters[0].parameterName && (
          <div style={{ paddingLeft: 13 }}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
            />
          </div>
        )}

        <div style={clasess.childLabelStyle}>
          {item?.parameterType === 0 ? (
            value?.label
          ) : (
            <div ref={ref}>
              <GomakeTextInput
                placeholder={value?.label}
                defaultValue={value?.value}
                style={{
                  ...clasess.textInputStyle,
                  border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
                }}
                onFocus={() => setIsFocused(true)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValueState(parseFloat(e.target.value) || 0)
                }
                value={valueState}
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

      {value?.subValue?.length > 0 && (
        <div>
          {value?.subValue?.map((value, index) => {
            return (
              <SubChildrenMapping
                key={`subChild_${index}`}
                paameters={paameters}
                item={item}
                value={value}
                clasess={clasess}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
export { ChildrenValuesMapping };
