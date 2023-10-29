import { GomakeTextInput } from "@/components";
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";
import { Checkbox } from "@mui/material";
import { SubChildrenMapping } from "./sub-children-mapping";

const ChildrenMapping = ({ paameters, item, index, clasess }) => {
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
              <div style={{ paddingLeft: 9 }}>
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
