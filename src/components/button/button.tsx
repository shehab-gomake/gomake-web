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
  // Get fallback values once
  const primaryColorValue = props.primaryColor(500);
  const defaultBorderColor = "#E0E0E0";
  const defaultFontFamily = FONT_FAMILY.Lexend(500, 16).fontFamily || "inherit";

  return {
    boxShadow: "none",
    textTransform: "none",
    padding: "14px",
    backgroundColor: `var(--theme-button-bg-primary, ${primaryColorValue})`,
    border: `1px solid var(--theme-button-border-color, ${defaultBorderColor})`,
    borderColor: `var(--theme-button-border-color, ${defaultBorderColor})`,
    height: props.height || 56,
    borderRadius: `var(--theme-button-radius, 4px)`,
    gap: 7,
    color: `var(--theme-button-text-primary, #FFFFFF)`,
    fontFamily: `var(--theme-typography-button-font-family, ${defaultFontFamily})`,
    fontWeight: `var(--theme-typography-button-font-weight, 500)`,
    fontSize: `var(--theme-typography-button-font-size, 16px)`,
    lineHeight: `var(--theme-typography-button-line-height, 24px)`,
    letterSpacing: `var(--theme-typography-button-letter-spacing, 0px)`,
    "&:hover": {
      backgroundColor: `var(--theme-button-bg-primary-hover, ${primaryColorValue})`,
      borderColor: `var(--theme-button-border-color, ${defaultBorderColor})`,
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
