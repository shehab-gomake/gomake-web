import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();

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
        gap: 40,
        marginBottom: 20,
      },
      headerTabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",
        paddingBottom: 6,
      },
      activeHeaderTabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6,
        cursor: "pointer",

        borderBottom: `1px solid ${secondColor(500)}`,
        paddingBottom: 5,
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
        gap: 50,
      },
      tabContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        // gap: 8,
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
        marginTop: 24,
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
        alignItems: "flex-end",
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
        width: "100%",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        // boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.08)",
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
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
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
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
