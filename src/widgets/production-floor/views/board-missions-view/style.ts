import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (notes, productWorksTypes) => {
  const columnOneGridTemplateRows =
    Array.isArray(notes) && notes.length > 0
      ? "calc(15% - 6px) auto"
      : "calc(10% - 6px) auto";

  const classes = useMemo(() => {
    return {
      GridContainer: {
        display: "grid",
        // gridTemplateColumns: "1fr 1fr",
        gridTemplateColumns: "calc(60% - 5px) calc(40% - 5px)",
        width: "100%",
        height: "calc(100% - 100px)",
        gap: "10px",
      },
      ColumnOneRowTwoGridContainer: {
        display: "grid",
        width: "100%",
        gap: "10px",
        gridTemplateColumns:
          productWorksTypes?.length > 0
            ? "calc(70% - 5px) calc(30% - 5px)"
            : "100%",
      },
      ColumnOne: {
        display: "grid",
        gridTemplateRows: columnOneGridTemplateRows,
        gap: "8px",
        // height: "100%",
        height: "calc(100% - 6px)",
        minHeight: 0,
        overflow: "hidden" as "hidden",
        boxSizing: "border-box" as "border-box",
      },
      ColumnTwo: {
        display: "grid",
        gridTemplateRows: "calc(50% - 4px) calc(50% - 4px)",
        gap: "8px",
        // height: "100%",
        height: "calc(100% - 6px)",
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
        overflowY: "auto" as "auto",
        minHeight: 0,
      },
      addNote: {
        color: "#ffffff",
        ...FONT_FAMILY.Inter(500, 14),
        padding: "0px",
        textTransform: "capitalize" as "capitalize",
      },
    };
  }, [notes, productWorksTypes]);
  return {
    classes,
  };
};
export { useStyle };
