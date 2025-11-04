import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const SecondaryButton = styled(Button)((props: ButtonProps) => {
  const { secondColor } = useGomakeTheme();
  const secondaryColor = secondColor(500);
  const secondaryLight = secondColor(100);
  return {
    boxShadow: "none",
    textTransform: "capitalize",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: 99,
    backgroundColor:
      props.variant == "contained"
        ? `var(--theme-secondary-color, ${secondaryColor})`
        : "#FFFFFF",
    borderRadius: "var(--theme-radius-md, 4px)",
    borderColor:
      props.variant === "text"
        ? ""
        : `var(--theme-secondary-color, ${secondaryColor})`,
    gap: 7,
    color:
      props.variant === "contained"
        ? "#FFFFFF"
        : `var(--theme-secondary-color, ${secondaryColor})`,
    "&:hover": {
      backgroundColor: `var(--theme-secondary-light, ${secondaryLight})`,
      borderColor: `var(--theme-secondary-color, ${secondaryColor})`,
      opacity: 0.8,
    },
    transition: "0.25s",
    ...FONT_FAMILY.Lexend(500, 16),
  };
});

export { SecondaryButton };
