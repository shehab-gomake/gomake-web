import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptLeft, adaptPaddingLeft, adaptPaddingRight, adaptRight } from "@/utils/adapter";
const useStyle = () => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { primaryColor, secondColor, errorColor, neutralColor, successColor } =
    useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        ...adaptPaddingRight(direction, 20),
      },
      mainRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 60,
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        ...adaptPaddingLeft(t("direction"), 20),
      },
      rightSideMainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 330,
        minWidth: 330,
        maxWidth: 330,
        height: "100%",
        backgroundColor: "white",
        boxShadow: "0px 0px 3px 0px rgba(129, 129, 129, 0.12)",
        padding: 15,
        marginTop: -53,
        borderRadius: 5,
        position: "fixed" as "fixed",
        ...adaptLeft(t("direction"), 0),
        overflow: "scroll",
        paddingBottom: 150,
      },
      rightSideContainer: {
        width: "100%",
      },
      tabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 40,
        marginBottom: 20,
        width: "100%",
        maxWidth: 900,
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 6,
        cursor: "pointer",
        width: "fit-content",
      },
      tabNameStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: primaryColor(500),
        width: "fit-content",
      },
      tabNameActiveStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
        width: "fit-content",
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
        marginBottom: 10,
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
        gap: 10,
        paddingBottom: 12,
      },
      parameterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        width: "fit-content",
      },
      underParameterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(900),
        width: "fit-content",
      },
      parameterType3ActiveLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
      parameterunderParameterStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: secondColor(500),
      },
      parameterRequierdLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
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
        gap: 10,
        width: "100%",
        minWidth: 180,
        maxWidth: 180,
      },
      parameterRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        width: "100%",
      },
      WastebasketNewStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "180px",
        minWidth: 180,
        maxWidth: 180,
        // height: 71,
        gap: 10,
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
        border: "0px",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#000",
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        border: "0px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      renderParameterTypeContainer: {
        display: "flex",
        width: "100%",
        maxWidth: "180px",
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
        border: `1px solid rgba(208, 213, 221, 1)`,
        color: "rgba(52, 64, 84, 1)",
        borderRadius: 8,
        padding: "8px 14px",
        ...FONT_FAMILY.Lexend(500, 14),
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
        ...FONT_FAMILY.Lexend(500, 14),
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
        height: 170,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 15,
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
        height: 35,
        maxHeight: 35,
        gap: 5,
      },
      totalStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
      },
      totalStyleText: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 24),
        width: "fit-content",
        minWidth: "fit-content",
        display: "flex",
        alignItems: "center",
        height: 35,
      },
      totalCurrancyStyle: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 14),
        width: "fit-content",
        minWidth: "fit-content",
        display: "flex",
        alignItems: "center",
        height: 35,
      },
      inputPriceStyle: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 24),
        height: "100%",
        width: "100%",
        maxHeight: 35,
        boxShadow: "none",
        textAlign: "center" as "center",
      },
      priceRecoveryContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: -8,
        marginBottom: 0,
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
        gap: 5,
        width: "100%",
        marginBottom: 16,
      },
      activeTabStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 10px",
        backgroundColor: primaryColor(500),
        color: "white",
        ...FONT_FAMILY.Lexend(500, 16),
        borderRadius: 4,
        cursor: "pointer",
      },
      activeLogsTabStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 10px",
        backgroundColor: secondColor(500),
        color: "white",
        ...FONT_FAMILY.Lexend(500, 16),
        borderRadius: 4,
        cursor: "pointer",
      },
      unActiveTabStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 10px",
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
        borderRadius: 12,
        height: 110,
        overflow: "scroll",
        padding: 5,
        border: "1px solid #ccc",
        color: "#000000",
        ...FONT_FAMILY.Lexend(500, 14),
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
      dropDownListWithSettingIcon: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 4,
      },
      duplicateSubSectionBtn: {
        backgroundColor: "#FFFF",
        border: "1px solid  rgba(208, 213, 221, 1)",
        color: "rgba(52, 64, 84, 1)",
        borderRadius: 8,
        height: 36,
        padding: "8px 14px",
        ...FONT_FAMILY.Inter(600, 14),
        width: "fit-content",
      },
      btnSelectedStyle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        padding: "8px 0px",
      },
      btnSelectedTextStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: "rgba(46, 48, 146, 1)",
      },
      btnSelectedIconReChoose: {
        width: 24,
        height: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      },
      logsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 8,
        width: "100%",
        height: 250,
        backgroundColor: primaryColor(50),
        padding: 10,
        overflowY: "scroll",
        overflowX: "hidden",
        gap: 10,
      },
      generalMsgTextStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#504FA1",
      },
      titleLogsTextStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: secondColor(500),
        width: "33%",
      },
      iconLogsTextStyle: {
        marginTop: 2.5,
        marginRight: 2.5,
      },
      textLogstyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: secondColor(500),
        width: "67%",
      },
    };
  }, [i18next.language, t, direction]);
  return {
    clasess,
  };
};
export { useStyle };
