import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor, errorColor, neutralColor } =
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
      mainRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 55,
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "68%",
      },
      rightSideMainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 330,
        minWidth: 330,
        maxWidth: 330,
        backgroundColor: "white",
        padding: 15,
        marginTop: -87,
        boxShadow: "0px 4px 40px 0px rgba(129, 129, 129, 0.12)",
        borderRadius: 5,
        // height: 720,
      },
      rightSideContainer: {
        height: "100%",
        overflow: "scroll",
        width: "100%",
      },
      tabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 40,
        marginBottom: 20,
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 6,
        cursor: "pointer",
      },
      tabNameStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: primaryColor(500),
      },
      tabNameActiveStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
      },
      selectedTabLine: {
        display: "flex",
        width: "100%",
        height: 1,
        backgroundColor: secondColor(500),
        marginTop: 10,
      },
      selectedTabNotLine: {
        display: "flex",
        width: "100%",
        height: 1,
        marginTop: 10,
      },
      sectionsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
      subSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      },
      subSectionTitleStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
        marginBottom: 16,
      },
      subSectionAccordionActiveStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: neutralColor(800),
      },
      activeTabContainer: {
        backgroundColor: "#EBECFF",
        minHeight: 48,
        borderBottom: "none",
      },
      headerAccordionContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
      },
      subSectionAccordionStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: primaryColor(500),
      },
      parametersContainer: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 16,
        paddingBottom: 24,
      },
      parameterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      parameterType3ActiveLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
      spanRequierd: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      parameterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        width: "fit-content",
        minWidth: 180,
      },
      parameterType3Container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 8,
        width: "fit-content",
      },

      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        // boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      renderParameterTypeContainer: {
        display: "flex",
        width: "95%",
        backgroundColor: "#FFF",
        borderRadius: 4,
      },

      switchStyle: {
        ".MuiSwitch-switchBase.Mui-checked": {
          color: "green",
        },
      },
      dynamicBtn: {
        height: 40,
        backgroundColor: "white",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
      },
      headerRightSide: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 8,
      },
      headerClientRightSide: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 16,
      },
      clientContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "62%",
      },
      labelTextStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(900),
        marginBottom: 10,
      },
      typeContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "35%",
      },
      flyerText: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      imgProductContainer: {
        width: "100%",
      },
      secondText: {
        color: primaryColor(200),
        ...FONT_FAMILY.Lexend(400, 12),
      },
      urgentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      urgentEstimateContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 18,
      },
      orderContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center" as "center",
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(500, 14),
        marginBottom: 16,
      },
      progress: {
        marginBottom: 8,
        width: "100%",
      },
      labelBrogressContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 18,
      },
      labelStyle: {
        color: primaryColor(800),
        ...FONT_FAMILY.Lexend(500, 14),
      },
      totalContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 8,
      },
      totalStyle: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 24),
      },
      inputPriceStyle: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 24),
        height: 28,
        width: "100px",
        boxShadow: "none",
      },
      priceRecoveryContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: -8,
        marginBottom: 16,
      },
      switchAdditionsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      additionsText: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(500, 18),
        marginBottom: 16,
      },
      tabsTypesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16,
        width: "100%",
        marginBottom: 16,
      },
      activeTabStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: primaryColor(500),
        color: "white",
        ...FONT_FAMILY.Lexend(500, 16),
        borderRadius: 4,
        cursor: "pointer",
      },
      unActiveTabStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(500, 16),
        border: `1px solid ${primaryColor(500)}`,
        borderRadius: 4,
        cursor: "pointer",
      },
      addOrderBtn: {
        backgroundColor: secondColor(500),
        height: 40,
        padding: 20,
        // marginTop: 34,
      },
      noVatStyle: {
        marginTop: 6,
        color: primaryColor(200),
        ...FONT_FAMILY.Lexend(400, 10),
      },
      errorMsgStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: errorColor(500),
        marginTop: 5,
        marginBottom: 5,
      },
      addPreviousContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        // marginTop: 30,
        width: "100%",
        gap: 16,
      },
      nextBtnStyle: {
        width: 110,
        height: 40,
        backgroundColor: secondColor(500),
      },
      previousBtnStyle: {
        width: 110,
        height: 40,
        backgroundColor: "white",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
      },
      productionStatus: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      sampleTypeStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        marginBottom: 10,
      },
      autoCompleteContainer: {
        marginBottom: 20,
        width: "100%",
      },
      multiLineContainer: {
        width: "100%",
      },
      multiLineTextInputStyle: {
        width: "100%",
        backgroundColor: "#EBECFF",
        borderRadius: 12,
        height: 110,
        overflow: "scroll",
      },
      pricingSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "#FFFFFF",
      },
      summaryContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        border: `1px solid ${primaryColor(500)}`,
        borderRadius: 5,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 16,
        paddingBottom: 20,
        marginTop: 22,
      },
      summaryStyle: {
        ...FONT_FAMILY.Lexend(700, 18),
        color: primaryColor(700),
        marginBottom: 17,
      },
      jobDetailsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 0px 20px 0px rgba(129, 129, 129, 0.1)",
        paddingTop: 12,
        paddingBottom: 20,
      },
      jobDetailsStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
        marginBottom: 8,
      },
      jobDetails: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(900),
        textAlign: "center" as "center",
        paddingLeft: 22,
        paddingRight: 22,
      },
      actionsStyleContainer: {
        ...FONT_FAMILY.Lexend(700, 18),
        color: primaryColor(700),
        marginTop: 24,
      },
      actionNameStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
        marginBottom: 18,
      },
      cellsContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        textAlign: "center" as "center",
        paddingTop: 14,
        backgroundColor: "rgba(246, 246, 246, 1)",
      },
      cellsContainerStyle2: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        textAlign: "center" as "center",
        paddingTop: 14,
        backgroundColor: "#FFF",
      },
      cellContainerMod: {
        paddingRight: 22,
        paddingBottom: 22,
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(500),
        minWidth: 135,
      },
      cellContainer: {
        paddingRight: 22,
        paddingBottom: 22,
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(500),
        minWidth: 135,
      },
      actoionsSelectContainer: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(500),
        border: "none",
        backgroundColor: "none",
        boxShadow: "none",
        height: 36,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
