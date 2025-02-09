import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      GridContainer: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        height: "100vh",
        gap: "10px",
      },
      ColumnOne: {
        display: "grid" as "grid",
        gridTemplateRows: "calc(20% - 6px) calc(35% - 6px) calc(45% - 6px)",
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
        gridTemplateColumns: "calc(30% - 4px) calc(70% - 4px)",
        width: "100%",
        height: "100%",
        gap: "8px",
        minHeight: 0,
        overflow: "hidden",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
