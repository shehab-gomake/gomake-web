import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      createNew: {
        width: "160px",
        height: "var(--theme-button-height, 40px)",
        borderRadius: "var(--theme-radius-md, 4px)",
        background: "var(--theme-button-bg-secondary, #DCDCEC)",
        color: "var(--theme-text-primary, #101020)",
        ...FONT_FAMILY.Lexend(500, 16),
        lineHeight: "20px",
        textTransform: "none",
        gap: "10px",
        "&:hover": {
          background: "var(--theme-button-bg-secondary-hover, #C8C8DC)",
        },
      },
      ticketStyle: {
        display: "flex",
        width: "192px",
        height: "40px",
        alignItems: "center",
        boxShadow: "none",
        borderRadius: "var(--theme-radius-md, 4px)",
      },
      ticketContentStyle: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "0px 10px",
        alignItems: "center",
      },
      numberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        lineHeight: "30px",
        //  width:"min-content"
      },
      textStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "17.5px",
        display: "flex",
        width: "100%",
        gap: "5px",
        alignItems: "center",
      },
      verticalLine: {
        borderLeft: "1px solid #000",
        height: "20px",
        margin: "0 5px",
      },
      numStyle: {
        ...FONT_FAMILY.Inter(600, 15),
        lineHeight: "20px",
      },
      ticketContent: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "0px",
        alignItems: "center",
        gap: "8px",
      },
      totalTextStyle: {
        ...FONT_FAMILY.Lexend(600, 14),
        lineHeight: "20px",
        display: "flex",
        width: "100%",
        gap: "8px",
        alignItems: "center",
      },
      cardStyle: {
        display: "inline-flex",
        padding: "12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        borderRadius: "8px",
        background: primaryColor(500),
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        height: "40px",
      },
      cardContainerStyle: {
        display: "inline-flex",
        padding: "12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        borderRadius: "8px",
        background: primaryColor(500),
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        height: "40px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
