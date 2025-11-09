import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const SecondaryButton = styled(Button)((props: ButtonProps) => {
  const { secondColor } = useGomakeTheme();
  return {
    boxShadow: "none",
    textTransform: "capitalize",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: 99,
    backgroundColor:
      props.variant == "contained" ? secondColor(500) : "#FFFFFF",
    borderRadius: "var(--theme-radius-md, 4px)",
    borderColor: props.variant === "text" ? "" : secondColor(500),
    gap: 7,
    color: props.variant === "contained" ? "#FFFFFF" : secondColor(500),
    "&:hover": {
      backgroundColor:
        props.variant === "outlined"
          ? `var(--theme-secondary-light, ${secondColor(100)})`
          : secondColor(100),
      borderColor: secondColor(500),
      borderRadius: "var(--theme-radius-md, 4px)",
    },
    transition: "0.25s",
    ...FONT_FAMILY.Lexend(500, 16),
  };
});

export { SecondaryButton };
