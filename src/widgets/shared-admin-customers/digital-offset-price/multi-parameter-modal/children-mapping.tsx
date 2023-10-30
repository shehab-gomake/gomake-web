import { GomakeTextInput } from "@/components";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  OutlinedInput,
  useFormControl,
} from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";
import { CheckboxCheckedIcon } from "./icons/checkbox-checked-icon";
import { CheckboxIcon } from "./icons/checkbox-icon";
import { useMemo } from "react";

const ChildrenMapping = ({ paameters, item, index, clasess, setFocused }) => {
  function MyFormHelperText() {
    const { focused } = useFormControl() || {};
    setFocused(focused);
    const helperText = useMemo(() => {
      if (focused) {
        return "This field is being focused";
      }

      return "Helper text";
    }, [focused]);

    return <FormHelperText>{helperText}</FormHelperText>;
  }
  return (
    <div
      style={{
        minWidth: index == 0 ? "50%" : "25%",
        maxWidth: index == 0 ? "50%" : "25%",
        textAlign: "left",
      }}
    >
      {item?.values.map((value) => (
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
                <FormControl>
                  <GomakeTextInput
                    placeholder={value?.label}
                    defaultValue={value?.value}
                    style={clasess.textInputStyle}
                  />
                </FormControl>
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
      ))}
    </div>
  );
};
export { ChildrenMapping };
