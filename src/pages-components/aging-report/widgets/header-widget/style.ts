import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "80%",
        gap: 20,
      },
      date1FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      date2FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "13%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      textInputStyle: {
        width: "100%",
        // border: "none",
      },
      inputsForQuotesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20,
      },
      dateStyle: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(500, 14),
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
      },
      datePickerContainer: {
        width: "50%",
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      datePickerinvidualContainer: {
        display: "flex",
        background: "#FFF",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        height: 40,
        width: "100%",
        padding: 10,
        cursor: "pointer",
        borderRadius: 5,
      },
      checkboxStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
      },
      labelSwichStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
