import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, primaryColor, grayColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        // borderRadius: "20px",
        border: "1px solid #F8F9FA",
      },
      statistics: {
        display: "flex",
        justifyContent: "space-between",
        gap: "32px",
        height: "80px",
      },
      header: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: primaryColor(900),
        marginBottom: "20px",
      },
      secContainer: {
        height: "100%",
        width: "100%",
        borderRadius: "16px",
        backgroundColor: "#FFF",
        position: "relative" as "relative",
        borderColor: "#EAECF0",
      },
      label: {
        ...FONT_FAMILY.Inter(600, 14),
        color: primaryColor(900),
      },
      marginLabel: {
        ...FONT_FAMILY.Inter(600, 12),
        color: grayColor(700),
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      value: {
        ...FONT_FAMILY.Inter(600, 14),
        color: "#2E3092",
      },
      iconWrapper: {
        backgroundColor: "white",
        opacity: "0.5",
        minWidth: "26px",
        height: "26px",
        borderRadius: "6px",
        display: "flex",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
