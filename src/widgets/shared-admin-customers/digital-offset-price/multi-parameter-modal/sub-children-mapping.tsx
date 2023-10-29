import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";

const SubChildrenMapping = ({ paameters, item, value, clasess }) => {
  return (
    <div style={clasess.childRowContainer}>
      {item?.parameterName === paameters[0].parameterName && (
        <div style={{ paddingLeft: 34 }}>
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
            style={clasess.textInputStyle}
            type="number"
          />
        )}
      </div>
    </div>
  );
};
export { SubChildrenMapping };
