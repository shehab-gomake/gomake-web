import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, secondColor, primaryColor } = useGomakeTheme()
  const classes = useMemo(() => {
    return {
      dropDownListStyle: {
        width: "150px",
        border: "none",
      },
      dateStyle: {
        width: "50%",
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(500, 18),
        color: secondColor(500),
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center"
      },
      datePickerContainer: {
        width: "50%",
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      insideStyle: {
        width: "max-content",
        height: "650px",
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        alignItems: "center",
        width: "max-content"
      },
      dividerContainer: {
        width: "95%",
        borderColor: secondColor(500),
      },
    };
  }, [theme]);

  return {
    classes,
  };
};

export { useStyle };