import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  adaptMarginLeft,
  convertWidthToVW,
  leftRightAdapter,
} from "@/utils/adapter";

const useStyle = () => {
  const { t } = useTranslation();
  const dir = t("direction");
  const { theme, secondColor, errorColor, successColor, primaryColor } =
    useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "hidden" as "hidden",
        // gap: 20,
        gap: 10,
      },
      headerStyle: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        gap: 10,
        justifyContent: "space-between",
        width: "100%",
      },
      rowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
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
        minWidth: "fit-content",
        width: "150px",
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
      searchInputStyle: {
        borderRadius: "4px",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08);",
        width: "100%",
        border: "none",
        height: "40px",
        marginRight: "0px",
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
        width: "50%",
        height: "600px",
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
      cancelIconStyle: {
        width: 62,
        height: 62,
        color: "#a1a2cd",
      },
      searchInput: {
        height: 40,
        minWidth: convertWidthToVW(200),
        borderRadius: 10,
      },
      createNewDocument: {
        display: "inline-flex",
        padding: "0px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        borderRadius: "8px",
        border: `1px solid ${primaryColor(500)}`,
        background: "#FFF",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        textTransform: "none" as "none",
        color: primaryColor(500),
        ...FONT_FAMILY.Inter(500, 14),
        lineHeight: "18px",
        height: "40px",
        "&:hover": {
          // backgroundColor: primaryColor(100),
        },
      },
      skeltonStyle: {
        width: "180px",
        height: "100%",
        borderRadius: "8px",
      },
      inputLbl: {
        ...FONT_FAMILY.Lexend(400, 14),
        display: "flex",
        alignItems: "center",
        width: "max-content",
        ...adaptMarginLeft(dir, 8),
      },
      packageLabelStyle: {
        ...FONT_FAMILY.Lexend(550, 14),
        color: primaryColor(400),
        marginBottom: 7,
      },
    };
  }, [i18next.language, t, theme]);
  return {
    classes,
  };
};
export { useStyle };
