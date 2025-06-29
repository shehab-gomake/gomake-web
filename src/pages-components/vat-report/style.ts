import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        padding:"0px 20px 20px 20px",
        overflowY: "scroll" as "scroll",
      },
      vatReportContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        width: "60%",
        flexWrap: "wrap" as "wrap",
        marginTop: 20,
      },
      vatReportItem: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      vatReportItemTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#000",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle }; 