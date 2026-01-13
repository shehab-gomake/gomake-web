import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

interface PrimaryButtonProps extends ButtonProps {
  hoverStyle?: boolean; // Optional prop to toggle custom hover styles
}

const PrimaryButton = styled(Button)<PrimaryButtonProps>((props) => {
  const { primaryColor } = useGomakeTheme();
  const primaryColorValue = primaryColor(500);
  const primaryLight = primaryColor(100);
  const primaryHover = primaryColor(500);
  const primaryDisabled = primaryColor(200);

  return {
    boxShadow: "none",
    textTransform: "capitalize",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: "100%",
    backgroundColor:
      props.variant === "contained"
        ? `var(--theme-primary-color, ${primaryColorValue})`
        : "#FFF",
    borderRadius: "var(--theme-radius-md, 4px)",
    borderColor: `var(--theme-primary-color, ${primaryColorValue})`,
    gap: 7,
    color:
      props.variant === "contained"
        ? "#FFFFFF"
        : `var(--theme-primary-color, ${primaryColorValue})`,
    transition: "all 0.25s ease",
    ...FONT_FAMILY.Lexend(500, 16),
    "&:hover": {
      backgroundColor:
        props.variant === "contained"
          ? `var(--theme-primary-hover, ${primaryHover})`
          : `var(--theme-primary-light, ${primaryLight})`,
      borderColor: `var(--theme-primary-color, ${primaryColorValue})`,
      boxShadow:
        props.variant === "contained"
          ? "0px 4px 8px rgba(0, 0, 0, 0.15)"
          : "none",
      transform: props.variant === "contained" ? "translateY(-1px)" : "none",
    },
    ...(props.hoverStyle &&
      props.variant === "contained" && {
        "&:hover": {
          backgroundColor: `var(--theme-primary-light, ${primaryLight})`,
          borderColor: `var(--theme-primary-color, ${primaryColorValue})`,
          opacity: 0.8,
          color: `var(--theme-primary-color, ${primaryColorValue})`,
        },
      }),
    "&.MuiButton-text": {
      backgroundColor: "inherit",
      color: `var(--theme-primary-color, ${primaryColorValue})`,
      width: "fit-content",
      "&:hover": {
        letterSpacing: 0,
      },
    },
    "&.MuiButton-outlined": {
      backgroundColor: "inherit",
      "&:hover": {
        letterSpacing: "0.1em",
      },
    },
    "&.Mui-disabled": {
      backgroundColor: `var(--theme-primary-disabled, ${primaryDisabled})`,
      color: "#FFFFFF",
    },
  };
});

export { PrimaryButton };
