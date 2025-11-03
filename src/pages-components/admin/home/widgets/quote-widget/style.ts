import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { adaptPaddingRight } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, errorColor, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        // height: "100%",
        paddingTop: 20,
        paddingBottom: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "var(--theme-bg-primary, #FFFFFF)",
        margin: "0 4px",
        borderRadius: "var(--theme-radius-lg, 8px)",
        border: "1px solid var(--theme-widget-border-color, transparent)",
        boxShadow:
          "var(--theme-widget-shadow, 0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08))",
        gap: 30,
      },
      customerSectionStyle: {
        width: "100%",
        gap: "10px",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
      },
      autoComplateRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 30,
      },
      selectCustomerContainer: {
        width: "100%",
        border: `none`,
        borderRadius: "4px",
        height: 40,
        display: "flex",
        alignItems: "center" as "center",
      },
      selectTypeContainer: {
        width: "100%",
        border: `none`,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
      },
      btnStyle: {
        height: 40,
      },
      errorMsgStyle: {
        padding: 10,
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      autoButtonStyle: {
        ...adaptPaddingRight(direction, 10),
        background: "none",
        color:
          "var(--theme-auto-button-color, var(--theme-primary-color, #2e3092))",
        TextAlign: "center",
        fontStyle: "normal",
        fontFamily:
          "var(--theme-auto-button-font-family, 'Lexend', sans-serif)",
        fontWeight: "var(--theme-auto-button-font-weight, 500)",
        fontSize: "var(--theme-auto-button-font-size, 14px)",
        lineHeight: "var(--theme-auto-button-line-height, 21px)",
        letterSpacing: "var(--theme-auto-button-letter-spacing, 0px)",
        border: "none",
        cursor: "pointer",
      },
      AmberIconStyle: {
        width: 120,
        height: 120,
        color: errorColor(300),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
