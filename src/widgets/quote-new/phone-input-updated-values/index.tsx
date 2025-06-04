import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { IBusinessWidget } from "@/interfaces";
import { UpdateValuePhoneInput } from "./update-value-phone-input";
import { clearPhoneNumberPrefix } from "@/utils/helpers";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";

const PhoneInputUpdatedValues = ({
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
  inputMainContainerStyle,
  isTwoDigit = false,
  placeholder,
}: IBusinessWidget) => {
  const { clasess } = useStyle({ isUnderLine });
  const [updateValue, setUpdateValue] = useState();
  const {
    CheckPreferenceValue
  } = usePrintHousePreferences()
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
  const getPlaceHolder = () => {
    let clearedValue = !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
      ? clearPhoneNumberPrefix(value)
      : value;
    let clearedPlaceHolder = !CheckPreferenceValue(
      EPreferences.SHOW_PHONE_PREFIX
    )
      ? clearPhoneNumberPrefix(placeholder)
      : placeholder;
    return clearedPlaceHolder
      ? clearedPlaceHolder
      : isTwoDigit
      ? clearedValue.toFixed(2)
      : clearedValue;
  };
  return (
    <>
      <div style={inputMainContainerStyle || clasess.inputMainContainer}>
        <div style={clasess.labelStyle}>{label}</div>
        {isUpdate ? (
          <UpdateValuePhoneInput
            clickedOut={() => onBlur()?.then()}
            onInputChange={onInputChange}
            onCancel={() => setIsUpdate(null)}
            onUpdate={() => onBlur()?.then()}
            value={updateValue}
          />
        ) : (
          <div
            style={{ ...clasess.inputTextStyle, ...specialStyle }}
            className="customInput"
            onClick={handleClick}
          >
            {getPlaceHolder()} {sign}
          </div>
        )}
      </div>
    </>
  );
};

export { PhoneInputUpdatedValues };
