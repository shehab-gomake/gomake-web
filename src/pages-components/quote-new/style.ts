import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (isQuoteConfirmation) => {
  const { secondColor, grayColor } = useGomakeTheme();
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
        marginBottom: 14,
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      },
      deleverdDate: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
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
        paddingBottom: 14,
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 14,
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
        padding : isQuoteConfirmation ? "20px 100px 0px 100px" : "none"
      },
      signatureApproval:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft:8,
        paddingRight:8,
        backgroundColor:"#04BB16",
        borderRadius: 8,
        ...FONT_FAMILY.Inter(600,12),
        color: "#FFF",
        height:43,
        cursor: "pointer",
      }
    };
  }, [isQuoteConfirmation]);
  return {
    classes,
  };
};
export { useStyle };
