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
        paddingRight: 34,
      },
      skeletonRowStyle: {
        marginTop: convertHeightToVH(10),
      },
      noDataContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        color: secondColor(500),
        height: 200,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 22),
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
        marginTop: convertWidthToVW(20),
        padding: convertWidthToVW(10),
        marginBottom: convertWidthToVW(30),
      },
      titleHeadersTale: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: convertWidthToVW(18),
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
        paddingTop: convertWidthToVW(16),
        paddingBottom: convertWidthToVW(16),
        paddingLeft: convertWidthToVW(12),
        cursor: "pointer",
      },
      bodyTableEvenContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#FFFFFF",
        paddingTop: convertWidthToVW(16),
        paddingBottom: convertWidthToVW(16),
        paddingLeft: convertWidthToVW(12),
        cursor: "pointer",
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
        paddingLeft: convertWidthToVW(7),
        marginTop: convertWidthToVW(10),
        gap: 7,
        cursor: "pointer",
      },
      addProductStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
      pricingAndExceptionsCointaner: {
        display: "flex",
        width: "100%",
        gap: 21,
      },
      pricingCointaner: {
        width: "59%",
      },
      exceptionsCointaner: {
        width: "41%",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
