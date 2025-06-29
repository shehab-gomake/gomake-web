import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {

  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap:20,
      },
      firstRow: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 20,
      },
      secondRow: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 20,
      },
      dateContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "20%",
      },
      dateLabel: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
      autoComplete: {
        width: "100%",
      },
      select: {
        width: "100%",
      },
      datePicker: {
        width: "100%",
      },
      dateInput: {
        width: "100%",
        border: "1px solid #ccc",
        borderRadius: 5,
        padding: 8,
        fontSize: 14,
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
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle }; 