import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      addBtn: {
        ...FONT_FAMILY.Lexend(500, 16),
        backgroundColor: primaryColor(100),
        color: primaryColor(900),
        "&:hover": {
          backgroundColor: primaryColor(200),
        },
        "& .MuiButton-startIcon": {
          margin: "0 8px",
        },
        textTransform: "capitalize",
      },
      addNewBtn: {
        borderRadius: "var(--theme-radius-md, 4px)",
        ...FONT_FAMILY.Lexend(500, 14),
        color: `var(--theme-secondary-color, ${primaryColor(500)})`,
        "&:hover": {
          backgroundColor: `var(--theme-secondary-light, ${primaryColor(200)})`,
        },
        "& .MuiButton-startIcon": {
          margin: "0 8px",
        },
        textTransform: "lowercase", // Set to 'lowercase'
      },
      deleteIcon: {
        cursor: "pointer",
        alignSelf: "flex-end",
        background: "none",
      },
      iconColor: secondColor(500),
      addButtonStyle: {
        display: "inline-flex",
        padding: "0px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        borderRadius: "var(--theme-button-radius, 4px)",
        border: `1px solid ${primaryColor(500)}`,
        background: "#FFF",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        textTransform: "none" as "none",
        color: primaryColor(500),
        ...FONT_FAMILY.Inter(500, 14),
        lineHeight: "18px",
        height: "40px",
      },
    };
  }, [theme]);
  return {
    classes,
    primaryColor,
  };
};
export { useStyle };
