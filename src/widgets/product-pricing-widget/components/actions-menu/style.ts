import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const useStyle = ({isUnderlined}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === 'rtl';
  const classes = useMemo(() => {
    return {
      mainContainer: {
        marginTop: isUnderlined?2:-45,
        marginLeft:isUnderlined?RTL?-80:80:224,
      },
      bodyContainer: {
        minWidth: 220,
        padding: "2px 10px",
        maxHeight: 500,
        overflowY: "auto" as "auto",
      },
      menuTabStyle: {
        padding: "8px 10px",
        ...FONT_FAMILY.Lexend(500, 12),
        color: "#182230",
        cursor: "pointer",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      textInputStyle: {
        marginBottom: 10,
        width: "100%",
        height: 36,
      },
    };
  }, [isUnderlined,RTL,dir]);
  return {
    classes,
  };
};
export { useStyle };
