import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { leftRightAdapter } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, successColor, secondColor, errorColor, neutralColor } =
    useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      subHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 16,
      },
      subHeaderLeftSide: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
      },
      selectProductContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: 180,
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      dropDownListByTableStyle: {
        width: "100%",
        height: 30,
        border: "0px",
        boxShadow: "none",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        color: primaryColor(500),
        backgroundColor: "transparent",
      },
      profitProductsCellStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
      },
      selectProductTextStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      cleanUpContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${secondColor(500)} `,
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
        padding: "10px 32px",
        marginLeft: 32,
        cursor: "pointer",
        borderRadius: 4,
        backgroundColor: "white",
        height: 40,
        width: 150,
      },
      searchContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 16),
        backgroundColor: secondColor(500),
        color: "white",
        cursor: "pointer",
        padding: "10px 32px",
        borderRadius: 4,
        height: 40,
        width: 120,
      },
      subHeaderRightSide: {
        display: "flex",
      },
      searchInputContainer: {
        width: 375,
        backgroundColor: "#FFFFFF",
        boxShadow: "5px 3px 150px 3px rgba(0, 0, 0, 0.08)",
        borderRadius: 10,
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 16),
        top: 8,
      },
      tableHeaderStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 10,

        backgroundColor: primaryColor(50),
        border: " 1px solid #EBECFF",
      },
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(800),
        width: "16%",
      },
      row: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#FFF",
        border: " 1px solid #EBECFF",
        height: 400,
        overflow: "scroll",
      },
      activeTabStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 14),
        color: successColor(500),
      },
      inActiveTabStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      line: {
        borderBottom: `0.4px solid ${neutralColor(400)}`,
        width: "100%",
        paddingBottom: 10,
        paddingTop: 5,
      },
      filtersSwichContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 8,
        width: "100%",
      },
      filterSwichContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
      },
      labelTextContainer: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(900),
      },
      backButtonStyle: {
        height: 30,
        marginRight: 5,
        background: "#CBCBE5",
        width: 90,
        borderRadius: 8,
      },
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: "#000",
      },
      subHeader: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: "#5759A8",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
