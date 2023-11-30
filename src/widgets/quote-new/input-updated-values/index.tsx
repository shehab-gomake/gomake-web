import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { IBusinessWidget } from "@/interfaces";

const InputUpdatedValues = ({
  label,
  value,
  isAnderLine,
  onBlur,
  isUpdate,
  setIsUpdate,
  onInputChange,
  speicalStyle,
  sign,
}: IBusinessWidget) => {
  const { clasess } = useStyle({ isAnderLine });
  const [updateValue, setUpdateValue] = useState();
  useEffect(() => {
    setUpdateValue(value);
  }, [value]);

  return (
    <>
      <div style={clasess.inputMainContainer}>
        <div style={clasess.labelStyle}>{label}</div>
        {isUpdate ? (
          <UpdateValueInput
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
            onClick={() => setIsUpdate(1)}
          >
            {value} {sign}
          </div>
        )}
      </div>
    </>
  );
};

export { InputUpdatedValues };
