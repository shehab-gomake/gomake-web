import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { IBusinessWidget } from "@/interfaces";

const InputUpdatedValues = ({
  label,
  value,
  isUnderLine,
  onBlur,
  isUpdate,
  setIsUpdate,
  onInputChange,
  speicalStyle,
  onClickFlag,
  flag,
  sign,
  isRightSign = false,
  inputMainContainerStyle,
  isTwoDigit = false,
  placeholder,
  width,
}: IBusinessWidget) => {
  const { clasess } = useStyle({ isUnderLine });
  const [updateValue, setUpdateValue] = useState();
  useEffect(() => {
    setUpdateValue(value);
  }, [value]);

  const handleClick = () => {
    if (flag) {
      onClickFlag();
    } else {
      setIsUpdate(1);
    }
  };

  return (
    <>
      <div style={inputMainContainerStyle || clasess.inputMainContainer}>
        <div style={clasess.labelStyle}>{label}</div>
        {isUpdate ? (
          <UpdateValueInput
            clickedOut={() => onBlur()?.then()}
            onInputChange={onInputChange}
            onCancel={() => setIsUpdate(null)}
            onUpdate={() => onBlur()?.then()}
            value={updateValue}
            width={width ? width : "210px"}
          />
        ) : (
          <div
            style={{ ...clasess.inputTextStyle, ...speicalStyle }}
            className="customInput"
            onClick={handleClick}
          >
            {isRightSign ? null : sign + " "}
            {placeholder
              ? placeholder
              : isTwoDigit
                ? typeof value === "number"
                  ? value.toFixed(2)
                  : value
                : value}
            {isRightSign ? "  " + sign : null}
          </div>
        )}
      </div>
    </>
  );
};

export { InputUpdatedValues };
