import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { Checkbox } from "@mui/material";
import { useState } from "react";

const SubChildrenMapping = ({ paameters, item, value, clasess }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [valueState, setValueState] = useState<number>(0);
  return (
    <div style={clasess.childRowContainer}>
      {item?.parameterName === paameters[0].parameterName && (
        <div style={{ paddingLeft: 38 }}>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValueState(parseFloat(e.target.value) || 0)
            }
            value={valueState}
          />
        )}
      </div>
    </div>
  );
};
export { SubChildrenMapping };
