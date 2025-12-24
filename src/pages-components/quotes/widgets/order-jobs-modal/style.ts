import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      // Modal styles (kept for backward compatibility)
      container: {
        padding: "20px",
      },
      paper: {
        borderRadius: "8px",
        border: `1px solid ${primaryColor(100)}`,
        overflow: "hidden",
      },
      tableRow: {
        backgroundColor: primaryColor(50),
      },
      headerCell: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: primaryColor(900),
        borderBottom: `1px solid ${primaryColor(200)}`,
      },
      bodyRow: {
        "&:nth-of-type(even)": {
          backgroundColor: primaryColor(25),
        },
        "&:hover": {
          backgroundColor: primaryColor(100),
        },
        cursor: "default",
        "&:hover td": {
          cursor: "default",
        },
      },
      bodyCell: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(700),
        padding: "12px",
      },
      emptyState: {
        textAlign: "center" as const,
        padding: "40px",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(500),
      },
      buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
      },
      // Card styles
      cardPaper: {
        borderRadius: "8px",
        border: `1px solid ${primaryColor(200)}`,
        maxWidth: "350px",
        minWidth: "280px",
        maxHeight: "400px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      },
      cardContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "400px",
      },
      cardContent: {
        padding: "12px",
        overflowY: "auto",
        flex: 1,
        minHeight: 0,
        // Custom scrollbar styling
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#9e9e9e",
          borderRadius: "3px",
          "&:hover": {
            background: "#757575",
          },
        },
        // Firefox scrollbar
        scrollbarWidth: "thin",
        scrollbarColor: "#9e9e9e transparent",
      },
      jobItem: {
        padding: "8px 0",
      },
      jobInfo: {
        display: "flex",
        gap: "8px",
        marginBottom: "6px",
        "&:last-child": {
          marginBottom: 0,
        },
      },
      jobLabel: {
        ...FONT_FAMILY.Lexend(600, 12),
        color: primaryColor(700),
        // minWidth: "90px",
      },
      jobValue: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(900),
        flex: 1,
      },
      divider: {
        margin: "6px 0",
        borderColor: primaryColor(200),
      },
      cardButtonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "8px 12px",
        borderTop: `1px solid ${primaryColor(200)}`,
        backgroundColor: "white",
        position: "sticky",
        bottom: 0,
        zIndex: 1,
        flexShrink: 0,
      },
      smallButton: {
        padding: "4px 12px",
        minWidth: "auto",
        fontSize: "12px",
        height: "28px",
        ...FONT_FAMILY.Lexend(500, 12),
      },
      emptyStateText: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(500),
        textAlign: "center" as const,
        padding: "20px",
      },
    };
  }, [primaryColor]);

  return {
    classes,
  };
};

export { useStyle };
