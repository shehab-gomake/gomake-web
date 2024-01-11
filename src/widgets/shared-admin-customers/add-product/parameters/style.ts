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
      headerTabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 80,
      },
      headerTabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        marginBottom: 25,
      },
      activeStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
      },
      unActiveStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: primaryColor(700),
      },
      mainRowContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
      },
      selectedTabLine: {
        display: "flex",
        width: "100%",
        height: 1,
        backgroundColor: secondColor(500),
        borderBottom: `1px solid ${secondColor(500)}`,
        marginTop: 10,
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 31,
      },

      tabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 40,
        width: "100%",
        maxWidth: 900,
        marginBottom: 31,
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        height: 30,
      },
      tabNameStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: primaryColor(500),
      },
      tabNameActiveStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
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
        marginBottom: 24,
      },
      subSectionTitleStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
        marginBottom: 16,
      },
      parametersContainer: {
        display: "flex",
        flexWrap: "wrap" as "wrap",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 16,
      },
      parameterLabelStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
      },
      spanRequierd: {
        color: errorColor(500),
      },
      parameterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "fit-content",
        minWidth: 180,
        marginBottom: 25,
      },
      parameterType3Container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "fit-content",
        minWidth: 180,
        marginBottom: 25,
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
      },
      renderParameterTypeContainer: {
        display: "flex",
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 4,
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
      },
      dynamicBtn: {
        height: 40,
        backgroundColor: "white",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
      },
      nameIconContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      textInputWithoutStyle: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        textAlign: "flex-start",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        width: "100%",
        height: 25,
        backgroundColor: "transparent",
        paddingLeft: 2,
        boxShadow: "none",
      },
      paramNameStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        minWidth: 120,
        height: 25,
        paddingLeft: 2,
      },
      plusIconStyle: {
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
      optionsContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      flagsInDropDownContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        paddingRight: 5,
      },
      addPreviousContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 50,
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
      activeTabContainer: {
        backgroundColor: "#EBECFF",
        minHeight: 48,
        marginTop: 20,
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
      subSectionAccordionActiveStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: neutralColor(800),
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
