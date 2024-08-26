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
        marginTop: 5,
        marginLeft: RTL ? 0 : -25,
        marginRight: RTL ? -25 : 0,
      },
      bodyContainer: {
        minWidth: 236,
        padding: "10px 15px",
      }
      ,
      menuTabStyle: {
        padding: "5px 0px",
        ...FONT_FAMILY.Lexend(500, 10),
        color: "#8283BE",
        cursor: "pointer",
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
