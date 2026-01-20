import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        padding: "20px",
      },
      pageTitle: {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 20px 0",
        ...FONT_FAMILY.Lexend(600, 24),
        color: primaryColor(900),
      },
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
      },
      header: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "16px",
      },
      emptyState: {
        textAlign: "center" as "center",
        padding: "40px",
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(400, 16),
      },
      tokensList: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
      },
      card: {
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
      cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      },
      statusBadge: {
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
        ...FONT_FAMILY.Lexend(500, 12),
      },
      cardDescription: {
        color: secondColor(500),
        marginBottom: "12px",
        ...FONT_FAMILY.Lexend(400, 14),
      },
      cardInfo: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        marginBottom: "16px",
        fontSize: "14px",
        ...FONT_FAMILY.Lexend(400, 14),
      },
      code: {
        backgroundColor: "#F3F4F6",
        padding: "2px 6px",
        borderRadius: "4px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: primaryColor(900),
      },
      cardActions: {
        display: "flex",
        justifyContent: "flex-end",
      },
      modalStyle: {
        width: "600px",
      },
      modalContent: {
        padding: "20px",
      },
      modalTitle: {
        fontSize: "20px",
        fontWeight: 600,
        marginBottom: "20px",
        ...FONT_FAMILY.Lexend(600, 20),
        color: primaryColor(900),
      },
      modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "24px",
      },
      warningText: {
        color: errorColor(500),
        marginBottom: "20px",
        padding: "12px",
        backgroundColor: "#FEE2E2",
        borderRadius: "4px",
        ...FONT_FAMILY.Lexend(400, 14),
      },
      secretContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
      },
      secretField: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
      },
      secretValue: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
        "& code": {
          flex: 1,
          padding: "8px",
          backgroundColor: "#F3F4F6",
          borderRadius: "4px",
          wordBreak: "break-all" as "break-all",
          fontFamily: "monospace",
          fontSize: "12px",
        },
      },
      secretLabel: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: primaryColor(900),
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        marginBottom: "16px",
      },
      inputLabel: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: primaryColor(900),
        display: "flex",
        gap: "4px",
      },
      input: {
        width: "100%",
      },
      required: {
        color: errorColor(500),
      },
    };
  }, [theme, primaryColor, secondColor, errorColor]);
  return {
    classes,
  };
};
export { useStyle };
