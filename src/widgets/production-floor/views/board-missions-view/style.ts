import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (notes) => {
  const columnOneGridTemplateRows =
    Array.isArray(notes) && notes.length > 0
      ? "1fr 1.75fr 2.25fr"
      : "0.5fr 1.75fr 2.25fr";

  const classes = useMemo(() => {
    return {
      GridContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        height: "calc(100vh - 230px)",
        gap: "10px",
      },
      ColumnOne: {
        display: "grid" as "grid",
        gridTemplateRows: columnOneGridTemplateRows,
        gap: "9px",
        height: "100%",
        minHeight: 0,
        overflow: "hidden" as "hidden",
        boxSizing: "border-box" as "border-box",
      },
      ColumnTwo: {
        display: "grid",
        gridTemplateRows: "calc(50% - 4px) calc(50% - 4px)",
        gap: "8px",
        height: "100%",
        minHeight: 0,
        overflow: "hidden" as "hidden",
        boxSizing: "border-box" as "border-box",
      },
      NestedGrid: {
        display: "grid",
        width: "100%",
        height: "100%",
        gap: "8px",
        minHeight: 0,
        overflow: "hidden",
      },
      productDetailsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "5px",
        flex: 1,
        overflowY: "scroll" as "scroll",
        minHeight: 0,
      },
      addNote: {
        color: "#ffffff",
        ...FONT_FAMILY.Inter(500, 14),
        padding: "0px",
        textTransform: "capitalize" as "capitalize",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
