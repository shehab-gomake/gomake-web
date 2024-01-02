import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { IBusinessWidget } from "@/interfaces";
import { UpdateValuePhoneInput } from "./update-value-phone-input";

const PhoneInputUpdatedValues = ({
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
  isTwoDigit = false,
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
      <div style={clasess.inputMainContainer}>
        <div style={clasess.labelStyle}>{label}</div>
        {isUpdate ? (
          <UpdateValuePhoneInput
            clickedOut={() => onBlur().then()}
            onInputChange={onInputChange}
            onCancel={() => setIsUpdate(null)}
            onUpdate={() => onBlur().then()}
            value={updateValue}
            
          />
        ) : (
          <div
            style={{ ...clasess.inputTextStyle, ...speicalStyle }}
            className="customInput"
            onClick={handleClick}
          >
            {isTwoDigit ? value.toFixed(2) : value} {sign}
          </div>
        )}
      </div>
    </>
  );
};

export { PhoneInputUpdatedValues };