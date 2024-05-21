import { printHouseProfile } from "@/store/print-house-profile";
import React, { useEffect, useState } from "react";
import {
  PhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { useRecoilValue } from "recoil";

interface IProps {
  onChange: (value: string) => void;
  value: string;
  autoFocus?: boolean;
  customStyle?: React.CSSProperties; // Add the style property
  defaultCountry?: string;

}


const PhoneInputComponent = ({ onChange, value, autoFocus, customStyle, defaultCountry }: IProps) => {

  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);
  console.log("defaultCountry", defaultCountry)
  return (
    <PhoneInput
      key={defaultCountry}
      defaultCountry={defaultCountry ? defaultCountry : printHouseProfileState.country?.toLowerCase()}
      value={value || ""}
      onChange={(value) => {
        value.length !== 4 && onChange(value);
      }}
      autoFocus={autoFocus}
      style={{ minWidth: 180, ...customStyle }}
    />
  );
};

export { PhoneInputComponent };
