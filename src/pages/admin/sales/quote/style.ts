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
      },
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 24,
        marginBottom: 7,
        // paddingLeft: 16,
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
      tableContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 26,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 32,
        marginTop: 20,
        // marginBottom: 10,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
      },
      btnTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
