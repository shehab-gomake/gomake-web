import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      customerInfoStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: 10,
        flexWrap: "wrap" as "wrap",
        gap: 10,
      },
      removeFormStyle: {
        display: "flex",
        justifyContent: "flex-start",
        gap: "7px",
      },
      buttonsStyle: {
        color: "var(--error-500, #D92C2C)",
        fontStyle: "normal",
        lineHeight: "normal",
        border: "none",
        background: "#FFF",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
      },
      changePassBtnStyle: {
        width: "180px",
        height: "40px",
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        gap: 3,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
