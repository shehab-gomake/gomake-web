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
      mainHeadecontainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 40,
      },
      addProductBtnStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#DCDCEC",
        borderRadius: 4,
        cursor: "pointer",
        width: 180,
        height: 40,
      },
      addProductBtnText: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101020",
      },
      tabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 34,
      },
      tabActiveContainer: {
        ...FONT_FAMILY.Lexend(500, 18),
        color: primaryColor(500),
        borderBottom: `2px solid ${primaryColor(500)}`,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: "pointer",
      },
      tabUnActiveContainer: {
        ...FONT_FAMILY.Lexend(500, 18),
        color: neutralColor(300),
        borderBottom: `2px solid ${neutralColor(300)}`,
        paddingBottom: 5,
        paddingLeft: 8,
        paddingRight: 8,
        cursor: "pointer",
      },
      gobackBtnStyle:{
        width:120,
        height:40
      }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
