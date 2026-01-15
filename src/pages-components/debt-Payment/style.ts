import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = (isQuoteConfirmation) => {
  const { secondColor, grayColor, primaryColor, theme } = useGomakeTheme();
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
      titleQuoteContainer: {
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
        gap: 15,
      },
      quoteStatusContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "4px 12px",
        backgroundColor: primaryColor(100),
        color: primaryColor(500),
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

      borderSecondContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 12,
        marginTop: 12,
        maxHeight: 140,
        overflow: "scroll",
        gap: "10px",
      },

      secondContainer: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as "column",
        padding: isQuoteConfirmation ? "20px 100px 0px 100px" : "none",
      },

      borderContainer: {
        width: "100%",
        alignSelf: "center",
        borderBottom: `1px solid ${grayColor(200)}`,
        maxHeight: 140,
        overflow: "scroll",
        marginTop: "20px",
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
    };
  }, [isQuoteConfirmation, theme]);
  return {
    classes,
  };
};
export { useStyle };
