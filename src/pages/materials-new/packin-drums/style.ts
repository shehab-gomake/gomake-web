import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      renderHeaderContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      },
      subRenderHeaderContainer: {
        width: "40%",
        display: "flex",
        alignItems: "center",
      },
      dropDownStyle: { width: "100%" },
      optionsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: primaryColor(50),
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      bodyRow: {
        display: "flex",
        width: "100%",
        minHeight: 60,
        textAlign: "center" as "center",
      },
      secondRow: {
        display: "flex",
        width: "100%",
        minHeight: 60,
        backgroundColor: "#F6F6F6",
        paddingBottom: 20,
        paddingTop: 20,
        textAlign: "center" as "center",
      },
      noData: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      noDataSpan: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        marginTop: 20,
        height: 42,
        color: secondColor(500),
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
      },
      addSupplierAutoComplate: {
        width: "100%",
        alignItems: "center",
        backgroundColor: primaryColor(10),
        textAlign: "center" as "center",
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer",
      },
      title: {
        ...FONT_FAMILY.Lexend(500, 20),
      },
      insideStyle: { width: "35%", height: "40%" },
      checkboxHeaderContainer: {
        width: "5%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      weightContainer: {
        width: "10%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -5,
        ...FONT_FAMILY.Lexend(500, 14),
      },
      rowWeightContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
      sizeContainer: {
        width: "13%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      thiknessContainer: {
        width: "13%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      costsContainer: {
        width: "15%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      maxBookThickness: {
        width: "25%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as "center",
      },
      thiknessTextInputStyle: {
        height: 38,
        display: "flex",
        textAlign: "center" as "center",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(500),
        width: "100%",
        backgroundColor: "transparent",
        boxShadow: "none",
      },
      twintyContainer: {
        width: "20%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      directionContainer: {
        width: "13%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      activeContainer: {
        width: "13%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      currencyContainer: {
        width: "16%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      stokContainer: {
        width: "20%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      sizeWaightsContainer: {
        width: "5%",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        minHeight: 60,
        paddingTop: 20,
        paddingBottom: 20,
        gap: 35,
      },
      checkboxSizeContainer: {
        width: "5%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      weightSizeContainer: {
        width: "10%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -5,
        ...FONT_FAMILY.Lexend(500, 14),
      },
      sheetSizeContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
      selectedSupplierContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
