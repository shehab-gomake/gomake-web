import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { IBusinessWidget } from "@/interfaces";
import { FONT_FAMILY } from "@/utils/font-family";

const InputUpdatedValues = ({
  label,
  value,
  isUnderLine,
  onBlur,
  isUpdate,
  setIsUpdate,
  onInputChange,
  specialStyle,
  onClickFlag,
  flag,
  sign,
  isRightSign = false,
  inputMainContainerStyle,
  isTwoDigit = false,
  placeholder,
  width,
  errorMessage,
}: IBusinessWidget) => {
  const { classes } = useStyle({ isUnderLine });
  const [originalValue, setOriginalValue] = useState(value);

  useEffect(() => {
    if (isUpdate) {
      setOriginalValue(value); // save on edit start
    }
  }, [isUpdate]);

  const handleClick = () => {
    if (flag) {
      onClickFlag();
    } else {
      setIsUpdate(1);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={inputMainContainerStyle || classes.inputMainContainer}>
          <div style={classes.labelStyle}>{label}</div>
          {isUpdate ? (
            <UpdateValueInput
              clickedOut={() => onBlur()?.then()}
              onInputChange={onInputChange}
              onCancel={() => {
                onInputChange(originalValue);
                setIsUpdate(null);
              }}
              onUpdate={() => onBlur()?.then()}
              value={value}
              width={width ? width : "210px"}
            />
          ) : (
            <div
              style={{ ...classes.inputTextStyle, ...specialStyle }}
              className="customInput"
              onClick={handleClick}
            >
              {isRightSign ? null : sign ? sign + " " : ""}
              {placeholder
                ? placeholder
                : isTwoDigit
                ? typeof value === "number"
                  ? value.toFixed(2)
                  : value
                : value}
              {isRightSign ? (sign ? "  " + sign : "") : null}
            </div>
          )}
        </div>
        {errorMessage && (
          <div
            style={{
              ...FONT_FAMILY.Lexend(400, 12),
              color: "#d32f2f",
              marginTop: "4px",
              marginLeft: "4px",
            }}
          >
            {errorMessage}
          </div>
        )}
      </div>
    </>
  );
};

export { InputUpdatedValues };
