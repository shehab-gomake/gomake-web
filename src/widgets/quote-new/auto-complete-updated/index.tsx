import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { IBusinessWidget } from "@/interfaces";
import { UpdateValueAutoComplete } from "@/components";

const AutoCompleteUpdatedValue = ({
  label,
  value,
  isAnderLine,
  onBlur,
  isUpdate,
  setIsUpdate,
  options,
  getOptionLabel,
  onChange,
}: IBusinessWidget) => {
  const { clasess } = useStyle({ isAnderLine });
  const [updateValue, setUpdateValue] = useState();
  useEffect(() => {
    setUpdateValue(value);
  }, [value]);

  const onChangeValue = (e: any, value: any) => {
    console.log("value", value);
  };
  return (
    <>
      <div style={clasess.inputMainContainer}>
        <div style={clasess.labelStyle}>{label}</div>
        {/* <UpdateValueAutoComplete
          clickedOut={() => onBlur()}
          // onInputChange={onInputChange}
          onCancel={() => setIsUpdate(null)}
          onUpdate={() => onBlur().then()}
          value={updateValue}
          options={options}
          getOptionLabel={getOptionLabel}
          onChange={onChangeValue}
        /> */}
        {isUpdate ? (
          <UpdateValueAutoComplete
            clickedOut={() => onBlur()}
            // onInputChange={onInputChange}
            onCancel={() => setIsUpdate(null)}
            onUpdate={() => onBlur().then()}
            value={updateValue}
            options={options}
            getOptionLabel={getOptionLabel}
            onChange={onChange}
          />
        ) : (
          <div
            style={clasess.inputTextStyle}
            className="customInput"
            onClick={() => setIsUpdate(1)}
          >
            {value}
          </div>
        )}
      </div>
    </>
  );
};

export { AutoCompleteUpdatedValue };
