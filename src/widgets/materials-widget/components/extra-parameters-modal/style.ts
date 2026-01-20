import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, secondColor , primarySecondaryBlend , theme} = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      dialogTitle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${secondColor(0.1)}`,
        padding: "16px 24px",
        backgroundColor: secondColor(0.02),
      },
      closeButton: {
        color: secondColor(0.6),
        "&:hover": {
          backgroundColor: secondColor(0.1),
        },
      },
      tableContainer: {
        maxHeight: "60vh",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      },
      headerCell: {
        textAlign: "center",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        backgroundColor: primarySecondaryBlend(50),
        color: "#333",
        fontSize: "14px",
        padding: "16px 12px",
        borderBottom: `2px solid ${primaryColor}`,
      },
      bodyCell: {
        textAlign: "center",
        padding: "12px",
        borderBottom: `1px solid ${secondColor(0.1)}`,
      },
      noDataBox: {
        textAlign: "center",
        padding: "40px",
        color: secondColor(0.5),
        fontSize: "14px",
      },
    };
  }, [ theme]);

  return { classes };
};

export { useStyle };
