import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useIsMobile } from "@/hooks/use-responsive";
import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const { theme, secondColor, errorColor, primaryColor } = useGomakeTheme();
  const isMobile = useIsMobile();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        // display: "flex",
        // flexDirection: "column" as "column",
        // alignItems: "flex-start",
        // justifyContent: "flex-start",
        // gap: 20,
        // paddingLeft: 20,
        // paddingRight: 20,
        // height: "100%",
        // overflowY: "auto" as "auto",
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "hidden" as "hidden",
        gap: 10,
      },
      filtersContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 20,
        width: 384,
        padding: 15,
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
        gap: "10px",
      },
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        minWidth: "47%",
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
        marginBottom: 7,
      },
      packageLabelStyle: {
        ...FONT_FAMILY.Lexend(550, 14),
        color: primaryColor(400),
        marginBottom: 7,
      },
      inputValueStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        boxSizing: "border-box" as "border-box",
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
        padding: "0px 8px",
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 40,
        zIndex: 99999999,
      },
      textInputForProductsStyle: {
        width: "100%",
      },
      searchInputStyle: {
        borderRadius: "var(--theme-input-border-radius, 4px)",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08);",
        width: "100%",
        marginRight: "0px",
        borderColor: "var(--theme-input-border-color, transparent) !important",
        borderWidth: "1px",
        borderStyle: "solid !important",
        background: "var(--theme-bg-primary, #FFFFFF)",
        height: "var(--theme-input-height, 40px)",
      },
      clearBtnStyle: {
        height: 40,
        backgroundColor: "#FFF",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
        width: "12.5%",
        minWidth: "fit-content",
      },
      paginationStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        height: "50px",
      },
      warningIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 10),
      },
      modalStyle: {
        width: isMobile ? "90vw" : "40%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
        zIndex: 999999,
      },
      materialsQuantityModalStyle: {
        width: isMobile ? "90vw" : "500px",
        maxWidth: isMobile ? "90vw" : "40%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
        zIndex: 999999,
        ...(isMobile && { padding: "0px 10px 10px 10px" }),
      },
      yesBtn: {
        height: 44,
        lineHeight: "18px",
        borderRadius: "8px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#2E3092",
        border: `1px solid #2E3092`,
        color: "#FFF",
        width: "fit-content",
      },
      noBtn: {
        textAlign: "center",
        height: 44,
        borderRadius: "8px",
        lineHeight: "18px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#FFF",
        color: "#272977",
        border: `1px solid #7375CD`,
        width: "fit-content",
      },
      cancelBtn: {
        height: 44,
        borderRadius: "8px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#FFF",
        color: "#344054",
        border: `1px solid #D0D5DD`,
        ...(!isMobile && { width: "33%" }),
        width: "fit-content",
      },
      subTitle: {
        ...FONT_FAMILY.Lexend(400, 13),
        color: "#475467",
        // textAlign: "center" as "center",
        // alignSelf: "center" as "center",
        marginBottom: 10,
        width: "70%",
      },
      tableAtagStyle: {
        color: "inherit" as "inherit",
        textDecoration: "unset" as "unset",
        userSelect: "text" as "text",
        display: "block",
        margin: "0 auto",
        lineHeight: "1.5",
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      storageContainer: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
      },
    };
  }, [theme, isMobile]);
  return {
    classes,
  };
};

export { useStyle };
