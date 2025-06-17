import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptMarginLeft } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = (isQuoteConfirmation) => {
  const { secondColor, grayColor, theme, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir = t("direction");
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        maxWidth: "100%",
        position: "relative" as "relative",
        height: "100%",
        overflow: "hidden",
      },
      titleQuateContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
      },
      settingsStatusContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
      },
      quoteStatusContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px 12px",
        backgroundColor: "#CBCBE4",
        color: "#252675",
        borderRadius: 16,
        ...FONT_FAMILY.Inter(500, 14),
      },
      titleSettingContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        // marginBottom: 14,
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      },
      dateFiled: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
        gap: "5px",
      },
      dateValue: {
        color: "black",
      },
      datePickerContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 17,
        borderBottom: `1px solid ${grayColor(200)}`,
      },
      firstBorder: {
        width: "100%",
        borderBottom: `1px solid ${grayColor(200)}`,
      },
      lineDateStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 1,
        height: 19,
        color: grayColor(200),
        backgroundColor: grayColor(200),
      },
      bordersecondContainer: {
        width: "100%",
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 12,
        marginTop: 12,
        maxHeight: 140,
        overflow: "scroll",
      },
      secondContainer: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as "column",
        padding: isQuoteConfirmation ? "20px 100px 0px 100px" : "none",
      },
      signatureApproval: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#04BB16",
        borderRadius: 8,
        ...FONT_FAMILY.Inter(600, 12),
        color: "#FFF",
        height: 43,
        cursor: "pointer",
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 18),
        color: "Black",
        lineHeight: "30px",
        width: "70%",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        alignSelf: "center",
        justifyContent: "center",
        gap: "16px",
        margin: "10px 0px",
      },
      borderContainer: {
        width: "100%",
        alignSelf: "center",
        borderBottom: `1px solid ${grayColor(200)}`,
        maxHeight: 140,
        overflow: "scroll",
        marginTop: "20px",
      },
      budgetList: {
        width: 185,
        height: 36,
        boxShadow: "none", // Shadow style
        borderRadius: 8,
        border:
          "1px solid var(--Component-colors-Components-Buttons-Secondary-button-secondary-border, #D0D5DD)",
        ...FONT_FAMILY.Lexend(500, 14),
        "& input::placeholder": {
          color: "#344054 !important",
          fontFamily: "Inter !important",
          fontWeight: 600,
          fontSize: "14px !important",
        },
      },
      createdByContainer: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: "#667085",
      },
      inputLbl: {
        ...FONT_FAMILY.Lexend(400, 14),
        display: "flex",
        alignItems: "center",
        width: "max-content",
        ...adaptMarginLeft(dir, 8),
      },
      createNewDocument: {
        display: "inline-flex",
        padding: "0px 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        borderRadius: "8px",
        border: "1px solid #2E3092",
        background: "#FFF",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        textTransform: "none" as "none",
        color: primaryColor(600),
        ...FONT_FAMILY.Inter(500, 14),
        lineHeight: "18px",
        height: "30px",
      },
    };
  }, [isQuoteConfirmation, theme]);
  return {
    classes,
  };
};
export { useStyle };
