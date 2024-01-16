import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface IProps {
  onChange: (value: string) => void;
  value: string;
  autoFocus?: boolean;
}

const PhoneInputComponent = ({ onChange, value, autoFocus }: IProps) => {
  return (
    <PhoneInput
      defaultCountry="il"
      value={value || ""}
      onChange={(value) => {
        value.length !== 4 && onChange(value);
      }}
      autoFocus={autoFocus}
      style={{ minWidth: 180 }}
    />
  );
};

export { PhoneInputComponent };
