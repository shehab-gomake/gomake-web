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
})((props: any) => ({
  boxShadow: "none",
  textTransform: "none",
  padding: "14px",
  lineHeight: "1.5px",
  backgroundColor: props.primaryColor(500),
  borderColor: "#FFFFFF",
  height: props.height || 56,
  borderRadius: 4,
  gap: 7,
  color: "#FFFFFF",
  "&:hover": {
    // letterSpacing: "0.1em",
    backgroundColor: props.primaryColor(500),
  },
  transition: "0.25s",
  width: "100%",
  ...FONT_FAMILY.Lexend(500, 16),
}));
const GomakePrimaryButton = ({ ...props }) => {
  const { primaryColor } = useGomakeTheme();
  return (
    <StyledButton
      {...props}
      // @ts-ignore
      primaryColor={primaryColor}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 8,
        }}
      >
        {props.leftIcon && (
          <span
            style={{
              display: "flex",
              justifyContent: "center ",
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
