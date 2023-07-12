import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor, neutralColor } = useGomakeTheme();

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
        marginBottom: 20,
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
      },
      addProductBtnText: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101020",
      },
      subHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
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
      },
      subHeaderRightSide: {
        display: "flex",
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 4px 40px 0px rgba(0, 0, 0, 0.08)",
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
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: primaryColor(50),
        border: " 1px solid #EBECFF",
      },
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(800),
        width: "10%",
      },
      row: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: "#FFF",
        border: " 1px solid #EBECFF",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
