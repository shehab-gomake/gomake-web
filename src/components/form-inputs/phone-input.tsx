import { printHouseProfile } from "@/store/print-house-profile";
import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useRecoilValue } from "recoil";

interface IProps {
  onChange: (value: string) => void;
  value: string;
  autoFocus?: boolean;
}

const PhoneInputComponent = ({ onChange, value, autoFocus }: IProps) => {
  const printHouseProfileState = useRecoilValue(printHouseProfile);
  return (
    <PhoneInput
     defaultCountry={printHouseProfileState?.country?.toLowerCase()}
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
