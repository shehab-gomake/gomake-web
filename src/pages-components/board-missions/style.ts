import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, secondColor, errorColor, primaryColor } = useGomakeTheme();
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
        height: "100%",
        overflowY: 'auto' as 'auto',

      },
      filtersContainer: {
        // display: "flex",
        // flexDirection: "row" as "row",
        // justifyContent: "space-between",
        // alignItems: "flex-end",
        // gap: 20,
        // width: "100%",

        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        width: "20vw",
        padding: "10px",
        flexWrap: "wrap" as "wrap",

      },
      selectedFilterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap" as "wrap",
      },
      buttonsFiltersContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        width: "100%",
        gap: "10px"
      },
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        minWidth: "40%",
        width: "fit-content",
      },
      buttonsFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      searchBtnStyle: {
        display: "flex",
        height: 40,
        backgroundColor: secondColor(500),
        width: "25%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        marginBottom: 7
      },
      packageLabelStyle: {
        ...FONT_FAMILY.Lexend(550, 14),
        color: primaryColor(400),
        marginBottom: 7
      },
      inputValueStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        boxSizing: 'border-box' as 'border-box',
        borderRadius: 4,
        height: 45,
        lineHeight: "21px",
        display: "flex",
        alignItems: "center",
        color: "#000000",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#FFF",
        width: "100%",
        borderBottom: `0px solid #FFFFFF`,
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 45,

      },
      clearBtnStyle: {
        height: 40,
        backgroundColor: "#FFF",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
        width: "12.5%",
        minWidth: "fit-content"
      },
      paginationStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        height: '50px'
      },
      warningIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
      modalStyle:{
        width: "25%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px"
      },
    };
  }, [theme]);
  return {
    classes,
  };
};

export { useStyle };