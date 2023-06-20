import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
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
        // paddingRight: convertWidthToVW(54),
      },
      skeletonRowStyle: {
        marginTop: convertHeightToVH(10),
      },
      noDataContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(500, 22),
        border: "1px solid #2E3092",
        borderRadius: 4,
        marginTop: convertWidthToVW(25),
        padding: convertWidthToVW(10),
        marginBottom: convertWidthToVW(35),
      },
      //Header Filter Style
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        // width: "100%",
        gap: convertWidthToVW(50),
        backgroundColor: "#FFFFFF",
        filter: "drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25))",
      },
      autoComplateStyle: {
        width: convertWidthToVW(301),
        border: "1px solid #FFFFFF",
      },
      //Product Table Style
      mainContainerForProductTable: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContainer: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        border: " 1px solid #FFFFFF",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
        borderRadius: 4,
        marginTop: convertWidthToVW(16),
        marginBottom: convertWidthToVW(30),
      },
      titleHeadersTale: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingRight: 11.5,
        paddingLeft: 11.5,
        paddingTop: 7,
        paddingBottom: 8,
        marginBottom: convertWidthToVW(10),
      },
      titleHederTextStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#B5B7C0",
      },
      bodyTableOddContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#EBECFF",
        paddingTop: convertWidthToVW(8),
        paddingBottom: convertWidthToVW(8),
        paddingLeft: convertWidthToVW(12),
        paddingRight: convertWidthToVW(4),
        cursor: "pointer",
        marginBottom: convertWidthToVW(10),
      },
      bodyTableEvenContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingTop: convertWidthToVW(8),
        paddingBottom: convertWidthToVW(8),
        paddingLeft: convertWidthToVW(12),
        paddingRight: convertWidthToVW(4),
        cursor: "pointer",
        marginBottom: convertWidthToVW(10),
      },
      nameStyle: {
        width: "20%",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#090A1D",
      },
      detailsStyle: {
        width: "60%",
        textAlign: "center" as "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#090A1D",
        borderRight: "4px solid #2E3092",
        paddingRight: 10,
      },
      moreStyle: {
        display: "flex",
        justifyContent: "flex-end",
        width: "20%",
      },
      addNewProductContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
      },

      addNewProductContainer2: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 17,
      },
      addProductStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
      pricingAndExceptionsCointaner: {
        display: "flex",
        width: "100%",
        gap: 24,
      },
      pricingCointaner: {
        width: "70%",
        dropShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      },
      exceptionsCointaner: {
        width: "41%",
      },
      titleActionName: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: primaryColor(500),
        marginTop: 24,
        marginBottom: 24,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
