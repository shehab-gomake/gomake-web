import { printHouseProfile } from "@/store/print-house-profile";
import React from "react";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useRecoilValue } from "recoil";
import { createGlobalStyle } from "styled-components";

interface IProps {
  onChange: (value: string) => void;
  value: string;
  autoFocus?: boolean;
  customStyle?: React.CSSProperties; // Add the style property
  defaultCountry?: string;
  variant?: "default" | "circular";
}

const PhoneInputComponent = ({
  onChange,
  value,
  autoFocus,
  customStyle,
  defaultCountry,
  variant = "default",
}: IProps) => {
  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);

  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const LTR = dir === "ltr";

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const inputHeight = customStyle?.height
    ? `${
        typeof customStyle.height === "number"
          ? customStyle.height + "px"
          : customStyle.height
      } !important`
    : "40px !important";

  const GlobalStyleCircular = createGlobalStyle`
    .react-international-phone-input-container .react-international-phone-input {
      height: ${inputHeight};
      width: 100%;
      border-radius: ${LTR ? "0px 8px 8px 0px" : "8px 0px 0px 8px"};
      border: 1px solid #D0D5DD !important;
      box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    }
    .react-international-phone-input-container .react-international-phone-country-selector-button {
      height: ${inputHeight};
      border-radius: ${LTR ? "8px 0px 0px 8px" : "0px 8px 8px 0px"};
      border: 1px solid #D0D5DD !important;
      box-shadow: 0px 1px 2px 0px rgba(4, 24, 65, 0.05);
    }
  `;

  const GlobalStyle = createGlobalStyle`
.react-international-phone-input-container .react-international-phone-input {
  height: ${inputHeight};
  border: 0px !important;
  width: 100%;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.08) !important;
}
.react-international-phone-input-container
  .react-international-phone-country-selector-button {
  height: ${inputHeight};
  border: 0px !important;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.08) !important;
}
`;

  return (
    <div onKeyPress={handleKeyPress}>
      {variant === "circular" ? <GlobalStyleCircular /> : <GlobalStyle />}
      <PhoneInput
        key={defaultCountry}
        defaultCountry={
          defaultCountry
            ? defaultCountry
            : printHouseProfileState.country?.toLowerCase()
        }
        value={value || ""}
        onChange={(value) => {
          value.length !== 4 && onChange(value);
        }}
        autoFocus={autoFocus}
        style={{ minWidth: 150, ...customStyle }}
      />
    </div>
  );
};

export { PhoneInputComponent };
