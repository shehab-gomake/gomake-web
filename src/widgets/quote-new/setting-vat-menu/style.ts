import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, theme } = useGomakeTheme();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const classes = useMemo(() => {
    return {
      mainContainer: {
        marginTop: 5,
        marginLeft: RTL ? 0 : -25,
        marginRight: RTL ? -25 : 0,
      },
      bodyContainer: {
        minWidth: 236,
        padding: "10px 15px",
      },
      menuTabStyle: {
        padding: "10px 0px",
        ...FONT_FAMILY.Lexend(600, 14),
        color: primaryColor(300),
        cursor: "pointer",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      selectedTabStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justify: "flex-start",
        alignItems: "flex-start",
        gpa: 5,
      },
      mainTabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 12,
      },
      selectedTabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 8,
        ...FONT_FAMILY.Lexend(600, 12),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
