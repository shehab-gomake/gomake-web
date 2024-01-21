import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { theme, secondColor, errorColor, successColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 20,
        paddingLeft: 20,
        paddingRight: 20,
      },
      headerStyle: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        gap: 10,
        justifyContent: "space-between",
        width:"100%"
      },
      filtersContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 20,
        width: "100%",
      },
      selectedFilterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
        width: "70%",
      },
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "25%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        height: 21,
      },
      textInputStyle: {
        width: "100%",
        border: "none",
      },
      searchBtnStyle: {
        height: 40,
        backgroundColor: secondColor(500),
      },
      clearBtnStyle: {
        height: 40,
        backgroundColor: "#FFF",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
        width: "50%",
      },
      paginationStyle: {
        display: "flex",
        height: "50px",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
      },
      warningIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
      insideStyle: {
        width: "40%",
        height: "540px",
      },
      openBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "98.47px",
        height: "26px",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: successColor(700),
        background: successColor(200),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      closeBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "98.47px",
        height: "fit-content",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: errorColor(600),
        background: errorColor(200),
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, [i18next.language, t, theme]);
  return {
    classes,
  };
};
export { useStyle };
