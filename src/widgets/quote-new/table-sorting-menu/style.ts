import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === 'rtl';
  const classes = useMemo(() => {
    return {
      mainContainer: {
        marginTop: -10,
        marginLeft: RTL ? 240 : -240,
      },
      bodyContainer: {
        minWidth: 236,
        padding: "2px 10px"
      },
      menuTabStyle: {
        padding: "8px 10px",
        ...FONT_FAMILY.Lexend(500, 10),
        color: "#8283BE",
        cursor: "pointer",
        backgroundColor: "#EBECFF"
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
