import { GomakeTextInput } from "@/components";
import { Checkbox, FormControl } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useState } from "react";

const ChildrenValuesMapping = ({ paameters, item, value, clasess }) => {
  const [isFocused, setIsFocused] = useState(false);
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
            <GomakeTextInput
              placeholder={value?.label}
              defaultValue={value?.value}
              style={{
                ...clasess.textInputStyle,
                border: isFocused ? "1px solid rgba(237, 2, 140, 1)" : "",
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
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
