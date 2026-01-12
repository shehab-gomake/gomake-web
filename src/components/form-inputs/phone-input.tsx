import { printHouseProfile } from "@/store/print-house-profile";
import React from "react";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useRecoilValue } from "recoil";
import { createGlobalStyle } from "styled-components";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { EPreferences } from "@/enums/prefernces";
import { FONT_FAMILY } from "@/utils/font-family";

interface IProps {
  onChange: (value: string) => void;
  value: string;
  autoFocus?: boolean;
  customStyle?: React.CSSProperties; // Add the style property
  defaultCountry?: string;
  variant?: "default" | "circular";
  placeholder?: string;
  labelText?: string;
}

const PhoneInputComponent = ({
  onChange,
  value,
  autoFocus,
  customStyle,
  defaultCountry,
  variant = "default",
  placeholder = "",
  labelText = "",
}: IProps) => {
  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);
  const { CheckPreferenceValue } = usePrintHousePreferences();
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
    : "var(--theme-input-height, 40px) !important";

  const GlobalStyleCircular = createGlobalStyle`
    .react-international-phone-input-container {
      direction: ${LTR ? "ltr" : "rtl"};
      display: flex;
      flex-direction: ${LTR ? "row" : "row-reverse"};
    }
    .react-international-phone-input-container .react-international-phone-input {
      height: ${inputHeight};
      width: 100%;
      border-radius: ${
        LTR
          ? `0px var(--theme-radius-md, 8px) var(--theme-radius-md, 8px) 0px`
          : `var(--theme-radius-md, 8px) 0px 0px var(--theme-radius-md, 8px)`
      };
      border: 1px solid var(--theme-input-border-color, none) !important;
      box-shadow: var(--theme-input-shadow, 0px 1px 2px 0px rgba(16, 24, 40, 0.05));
      text-align: ${LTR ? "left" : "right"};
      background-color: var(--theme-bg-primary, #FFF);
    }
    .react-international-phone-input-container .react-international-phone-country-selector-button {
      height: ${inputHeight};
      border-radius: ${
        LTR
          ? `var(--theme-radius-md, 8px) 0px 0px var(--theme-radius-md, 8px)`
          : `0px var(--theme-radius-md, 8px) var(--theme-radius-md, 8px) 0px`
      };
      border: 1px solid var(--theme-input-border-color, none) !important;
      box-shadow: var(--theme-input-shadow, 0px 1px 2px 0px rgba(4, 24, 65, 0.05));
      background-color: var(--theme-bg-primary, #FFF);
    }

    .react-international-phone-input::placeholder {
     color: var(--theme-input-placeholder-color, #B1B1B1) !important;
  opacity: 1;
  font-family: var(--theme-font-family-base, 'Heebo'), sans-serif;
  font-style: normal;
  font-weight: var(--theme-font-weight-medium, 500);
  }
  `;

  const GlobalStyle = createGlobalStyle`
.react-international-phone-input-container {
  direction: ${LTR ? "ltr" : "rtl"};
  display: flex;
  flex-direction: ${LTR ? "row" : "row-reverse"};
}
.react-international-phone-input-container .react-international-phone-input {
  height: ${inputHeight};
  border: 1px solid var(--theme-input-border-color, none) !important;
  width: 100%;
  box-shadow: var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08)) !important;
  -webkit-appearance: none;
  text-align: ${LTR ? "left" : "right"};
  border-radius: ${
    LTR
      ? `0px var(--theme-radius-md, 8px) var(--theme-radius-md, 8px) 0px`
      : `var(--theme-radius-md, 8px) 0px 0px var(--theme-radius-md, 8px)`
  };
  background-color: var(--theme-bg-primary, #FFF);
}
.react-international-phone-input-container
  .react-international-phone-country-selector-button {
  height: ${inputHeight};
  border: 1px solid var(--theme-input-border-color, none) !important;
  box-shadow: var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08)) !important;
  border-radius: ${
    LTR
      ? `var(--theme-radius-md, 8px) 0px 0px var(--theme-radius-md, 8px)`
      : `0px var(--theme-radius-md, 8px) var(--theme-radius-md, 8px) 0px`
  };
  background-color: var(--theme-bg-primary, #FFF);
}

.react-international-phone-input::placeholder {
 color: var(--theme-input-placeholder-color, #B1B1B1) !important;
  opacity: 1;
  font-family: var(--theme-font-family-base, 'Heebo'), sans-serif;
  font-style: normal;
  font-weight: var(--theme-font-weight-medium, 500);
  }
`;
  //
  return (
    <div onKeyPress={handleKeyPress} dir={dir}>
      {variant === "circular" ? <GlobalStyleCircular /> : <GlobalStyle />}
      {labelText && (
        <div style={{ ...FONT_FAMILY.Lexend(600, 14) }}>{labelText}</div>
      )}
      <PhoneInput
        key={defaultCountry}
        defaultCountry={
          defaultCountry
            ? defaultCountry
            : printHouseProfileState.country?.toLowerCase()
        }
        hideDropdown={!CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)}
        disableDialCodeAndPrefix={
          !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
        }
        disableFormatting={
          !CheckPreferenceValue(EPreferences.SHOW_PHONE_PREFIX)
        }
        value={value || ""}
        onChange={(value) => {
          value.length !== 4 && onChange(value);
        }}
        autoFocus={autoFocus}
        style={{ minWidth: 150, ...customStyle }}
        placeholder={placeholder}
      />
    </div>
  );
};

export { PhoneInputComponent };
