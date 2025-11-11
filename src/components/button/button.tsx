import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const StyledButton = styled(Button, {
  shouldForwardProp: (propName: any) =>
    propName !== "secondColor" &&
    propName !== "primaryColor" &&
    propName !== "errorColor",
})((props: any) => {
  // Helper to get CSS variable or fallback
  const getThemeValue = (cssVar: string, fallback: string) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const cssValue = computedStyle.getPropertyValue(cssVar).trim();
      return cssValue || fallback;
    }
    return fallback;
  };

  return {
    boxShadow: "none", // No box shadow as requested
    textTransform: "none",
    padding: "14px",
    backgroundColor: getThemeValue(
      "--theme-button-bg-primary",
      props.primaryColor(500)
    ),
    border: `1px solid ${getThemeValue(
      "--theme-button-border-color",
      "#E0E0E0"
    )}`, // Border with theme support
    borderColor: getThemeValue("--theme-button-border-color", "#E0E0E0"),
    height: props.height || 56,
    borderRadius: getThemeValue("--theme-button-radius", "4px"),
    gap: 7,
    color: getThemeValue("--theme-button-text-primary", "#FFFFFF"),
    fontFamily: getThemeValue(
      "--theme-typography-button-font-family",
      FONT_FAMILY.Lexend(500, 16).fontFamily || "inherit"
    ),
    fontWeight: getThemeValue("--theme-typography-button-font-weight", "500"),
    fontSize: getThemeValue("--theme-typography-button-font-size", "16px"),
    lineHeight: getThemeValue("--theme-typography-button-line-height", "24px"),
    letterSpacing: getThemeValue(
      "--theme-typography-button-letter-spacing",
      "0px"
    ),
    "&:hover": {
      backgroundColor: getThemeValue(
        "--theme-button-bg-primary-hover",
        props.primaryColor(500)
      ),
      borderColor: getThemeValue("--theme-button-border-color", "#E0E0E0"),
    },
    transition: "0.25s",
    width: "100%",
  };
});

const GomakePrimaryButton = ({ ...props }) => {
  const { primaryColor } = useGomakeTheme();
  return (
    <StyledButton
      {...props}
      // @ts-ignore
      primaryColor={primaryColor}
    >
      <div
        style={
          (props.leftIcon || props.rightIcon) && {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
          }
        }
      >
        {props.leftIcon && (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {props.leftIcon}
          </span>
        )}
        <span
          style={{
            width: props.leftIcon ? "fit-content" : "100%",
          }}
        >
          {props.children}
        </span>
        {props.rightIcon && (
          <span
            style={{
              display: "flex",
              justifyContent: "center ",
              alignItems: "center",
            }}
          >
            {props.rightIcon}
          </span>
        )}
      </div>
    </StyledButton>
  );
};

export { GomakePrimaryButton };
