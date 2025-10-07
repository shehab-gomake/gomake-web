import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        maxHeight: "calc(90vh - 150px)",
        overflowY: "auto" as const,
        padding: "20px",
      },
      accordionSummary: {
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        marginBottom: "8px",
        "& .MuiAccordionSummary-content": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        },
      },
      categoryTitle: {
        fontWeight: 600,
        color: primaryColor(500),
      },
      badgeContainer: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
      },
      badge: {
        backgroundColor: primaryColor(100),
        color: primaryColor(700),
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
      },
      deletedBadge: {
        backgroundColor: errorColor(100),
        color: errorColor(700),
      },
      sectionTitle: {
        fontWeight: 600,
        marginBottom: "12px",
        color: secondColor(700),
      },
      tableContainer: {
        maxHeight: "400px",
        overflow: "auto",
        border: `1px solid ${secondColor(200)}`,
        borderRadius: "8px",
      },
      headerCell: {
        backgroundColor: secondColor(50),
        fontWeight: 600,
        color: secondColor(900),
        borderBottom: `2px solid ${secondColor(300)}`,
        padding: "12px 16px",
        whiteSpace: "nowrap" as const,
      },
      tableRow: {
        "&:hover": {
          backgroundColor: secondColor(50),
        },
      },
      selectedRow: {
        backgroundColor: primaryColor(50),
        "&:hover": {
          backgroundColor: primaryColor(100),
        },
      },
      tableCell: {
        padding: "12px 16px",
        borderBottom: `1px solid ${secondColor(200)}`,
      },
      deletedHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      selectAllContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      buttonsContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginTop: "24px",
        paddingTop: "16px",
        borderTop: `1px solid ${secondColor(200)}`,
      },
      deleteButton: {
        backgroundColor: errorColor(500),
        color: "#fff",
        padding: "10px 24px",
        borderRadius: "8px",
        fontWeight: 600,
        "&:hover": {
          backgroundColor: errorColor(600),
        },
        "&:disabled": {
          backgroundColor: secondColor(300),
          color: secondColor(500),
        },
      },
      cancelButton: {
        backgroundColor: "transparent",
        color: "rgb(52, 64, 84)",
        padding: "10px 24px",
        borderRadius: "8px",
        fontWeight: 600,
        border: `1px solid rgb(208, 213, 221)`,
      },
      emptyState: {
        textAlign: "center" as const,
        padding: "40px",
        color: secondColor(500),
      },
    };
  }, [primaryColor, secondColor, errorColor]);

  return { classes };
};

export { useStyle };

