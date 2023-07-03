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
      rightSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "22%",
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
        gap: 8,
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
        ...FONT_FAMILY.Lexend(600, 16),
        color: "#090A1D",
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
        width: 180,
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.08)",
      },
      renderParameterTypeContainer: {
        display: "flex",
        width: "95%",
        backgroundColor: "#FFF",
        borderRadius: 4,
      },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.08)",
      },
      switchStyle: {
        ".MuiSwitch-switchBase.Mui-checked": {
          color: "green", // Change this to your desired background color
        },
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
