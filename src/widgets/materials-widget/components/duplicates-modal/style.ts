import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const classes = useMemo(() => {
    return {
      modalContent: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column" as const,
      },
      container: {
        width: "100%",
        flex: 1,
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        padding: "20px",
        maxHeight: "calc(90vh - 220px)", // Leave space for footer
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      },
      accordionSummary: {
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
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
      tableContainerWrapper: {
        position: "relative" as const,
        width: "100%",
      },
      tableContainer: {
        maxHeight: "400px",
        overflowX: "auto" as const,
        overflowY: "auto" as const,
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        position: "relative" as const,
        '&::-webkit-scrollbar': {
          height: '8px',
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      },
      headerCell: {
        backgroundColor: "#EBECFF",
        fontWeight: "bold" as const,
        color: "#000",
        borderBottom: "1px solid #e0e0e0",
        padding: "4px 8px",
        whiteSpace: "nowrap" as const,
        textAlign: "center" as const,
        position: "sticky" as const,
        top: 0,
        zIndex: 100,
      },
      tableRow: {
        "&:hover": {
          backgroundColor: "#f8f9fa",
        },
      },
      selectedRow: {
        backgroundColor: primaryColor(50),
        "&:hover": {
          backgroundColor: primaryColor(100),
        },
      },
      tableCell: {
        padding: "12px 8px",
        borderBottom: "1px solid #e0e0e0",
        textAlign: "center" as const,
        whiteSpace: "nowrap" as const,
      },
      deletedHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
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
        padding: "16px 20px",
        borderTop: `1px solid #e0e0e0`,
        backgroundColor: "#fff",
        position: "sticky" as const,
        bottom: 0,
        zIndex: 200,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
      },
      deleteButton: {
        backgroundColor: errorColor(500),
        color: "#fff",
        padding: "10px 24px",
        borderRadius: "8px",
        fontWeight: 600,
        height: 46,
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
        height: 46,
      },
      emptyState: {
        textAlign: "center" as const,
        padding: "40px",
        color: secondColor(500),
      },
      scrollIndicatorButton: {
        position: 'absolute' as const,
        top: '50%',
        [isRTL ? 'left' : 'right']: '10px',
        transform: 'translateY(-50%)',
        backgroundColor: primaryColor(500),
        color: '#fff',
        width: '32px',
        height: '32px',
        minWidth: '32px',
        boxShadow: `0 4px 12px ${primaryColor(300)}`,
        zIndex: 150,
        '&:hover': {
          backgroundColor: primaryColor(600),
          boxShadow: `0 6px 16px ${primaryColor(400)}`,
        },
        '&:active': {
          transform: 'translateY(-50%) scale(0.95)',
        },
        transition: 'all 0.2s ease-in-out',
        '@keyframes pulse': {
          '0%': {
            boxShadow: `0 4px 12px ${primaryColor(300)}`
          },
          '50%': {
            boxShadow: `0 6px 20px ${primaryColor(500)}`
          },
          '100%': {
            boxShadow: `0 4px 12px ${primaryColor(300)}`
          }
        },
        animation: 'pulse 2s ease-in-out infinite'
      },
    };
  }, [primaryColor, secondColor, errorColor, isRTL]);

  return { classes };
};

export { useStyle };

