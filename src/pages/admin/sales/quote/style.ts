import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        paddingLeft: 16,
        paddingRight: 16,
      },
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      rightSideHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 34,
      },
      uploadContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        background: "#DCDCEC",
        borderRadius: 4,
        gap: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        cursor: "pointer",
      },
      uploadTextStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101020",
      },
      deleverdDate: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
