import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, secondColor , errorColor} = useGomakeTheme();
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
        height:"100%",
        overflowY: 'auto' as 'auto',

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
        alignItems: "flex-end",
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
      searchBtnStyle: {
        display: "flex",
        height: 40,
        backgroundColor: secondColor(500),
        width: "25%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        border: "none",
      },
      clearBtnStyle: {
        height: 40,
        backgroundColor: "#FFF",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
        width: "12.5%",
        minWidth:"fit-content"
      },
      paginationStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        height:'50px'
      },
      warningIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
