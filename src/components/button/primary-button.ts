import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

interface PrimaryButtonProps extends ButtonProps {
  hoverStyle?: boolean; // Optional prop to toggle custom hover styles
}

const PrimaryButton = styled(Button)<PrimaryButtonProps>((props) => {
  const { primaryColor } = useGomakeTheme();

  return {
    boxShadow: "none",
    textTransform: "capitalize",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: "100%",
    backgroundColor: props.variant === "contained" ? primaryColor(500) : "#FFF",
    borderRadius: 4,
    borderColor: primaryColor(500),
    gap: 7,
    color: props.variant === "contained" ? "#FFFFFF" : primaryColor(500),
    transition: "0.25s",
    ...FONT_FAMILY.Lexend(500, 16),
    "&:hover": {
      letterSpacing: "0.1em",
      backgroundColor:
        props.variant === "contained" ? primaryColor(500) : "#FFF",
      borderColor: primaryColor(500),
    },
    ...(props.hoverStyle &&
      props.variant === "contained" && {
        "&:hover": {
          backgroundColor: primaryColor(100),
          borderColor: primaryColor(500),
          opacity: 0.8,
          color: primaryColor(500),
        },
      }),
    "&.MuiButton-text": {
      backgroundColor: "inherit",
      color: primaryColor(500),
      width: "fit-content",
      "&:hover": {
        letterSpacing: 0,
      },
    },
    "&.Mui-disabled": {
      backgroundColor: primaryColor(200),
      color: "#FFFFFF",
    },
  };
});

export { PrimaryButton };
