import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, neutralColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      tableHeaderStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: primaryColor(50),
        border: " 1px solid #EBECFF",
      },
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(800),
        width: "150px",
      },

      row: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: "#FFF",
        border: " 1px solid #EBECFF",
      },
      line: {
        borderBottom: `0.4px solid ${neutralColor(400)}`,
        width: "100%",
        paddingBottom: 10,
        paddingTop: 5,
      },
      detailsStyle: {
        width: "60%",
        textAlign: "center" as "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#090A1D",
        paddingRight: 10,
        overflow: "auto",
        maxHeight: 30,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
