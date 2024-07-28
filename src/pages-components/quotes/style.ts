import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";

const useStyle = () => {
  const { t } = useTranslation();
  const { theme, secondColor, errorColor, successColor, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "hidden" as "hidden",
        marginBottom: "20px",
        gap: 20,
      },
      headerStyle: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        gap: 10,
        justifyContent: "space-between",
        width: "100%"
      },
      rowStyle:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:10,
      },
      filtersContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        //width: "500px",
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
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        minWidth:"40%",
        width: "fit-content",
      },
      buttonsFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
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
      //  border: `1px solid ${secondColor(500)}`,
        color: "black",
       // width: "50%",
      },
      paginationStyle: {
        display: "flex",
        height: "50px",
        width: "100%",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
      },
      warningIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
      insideStyle: {
        width: "600px",
        height: "520px",
      },
      openBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // width: "98.47px",
        height: "26px",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: successColor(300),
        //  background: successColor(300),
        ...FONT_FAMILY.Lexend(600, 14),
      },
      closeBtnStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // width: "98.47px",
        height: "fit-content",
        padding: "4px, 12px, 4px, 12px",
        borderRadius: "4px",
        gap: "10px",
        color: errorColor(300),
        //  background: errorColor(300),
        ...FONT_FAMILY.Lexend(600, 14),
      },
      createNew: {
        width: "160px",
        height: "40px",
        borderRadius: "4px",
        background: "#DCDCEC",
        color: "#101020",
        ...FONT_FAMILY.Lexend(500, 16),
        lineHeight: "20px",
        textTransform: "none" as "none",
        gap: "10px",
      },
      priceDivStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
      },


      /// TEST ///
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        padding: 15,
      },
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(300),
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 10),   
      },
      searchInput: {
        height: 40,
        minWidth: convertWidthToVW(200),
        borderRadius: 10,
      },
    };
  }, [i18next.language, t, theme]);
  return {
    classes,
  };
};
export { useStyle };