import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH } from "@/utils/adapter";

const useStyle = () => {
  const { theme, primaryColor, secondColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "hidden",
      },
      headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: convertHeightToVH(50),
        flexShrink: 0,
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
        height: "100%",
        maxHeight: "calc(100vh - 200px)",
        overflow: "hidden",
      },
      header: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "16px",
        flexShrink: 0,
      },
      emptyState: {
        textAlign: "center" as "center",
        padding: "40px",
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(400, 16),
        overflowY: "auto" as "auto",
        flex: 1,
      },
      tokensList: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
        overflowY: "auto" as "auto",
        flex: 1,
        paddingRight: "8px",
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
        maxWidth: "90vw",
        height: "auto",
        maxHeight: "90vh",
        overflow: "hidden",
      },
      modalContent: {
        padding: "16px 16px 8px 16px",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "24px",
        width: "100%",
        boxSizing: "border-box" as "border-box",
        overflow: "hidden",
      },
      modalTitle: {
        fontSize: "24px",
        fontWeight: 500,
        margin: 0,
        padding: 0,
        fontFamily: "'Forma DJR UI', sans-serif",
        color: "#1A1A1A",
        lineHeight: "32px",
      },
      modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "8px",
        paddingTop: "24px",
        borderTop: "1px solid #E0E0E0",
      },
      warningText: {
        color: errorColor(500),
        marginBottom: "20px",
        padding: "12px 16px",
        backgroundColor: "#FEE2E2",
        borderRadius: "8px",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontSize: "14px",
        lineHeight: "20px",
      },
      secretContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
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
          padding: "12px",
          backgroundColor: "#F9FAFB",
          borderRadius: "8px",
          wordBreak: "break-all" as "break-all",
          fontFamily: "monospace",
          fontSize: "13px",
          border: "1px solid #E0E0E0",
        },
      },
      secretLabel: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "21px",
        color: "#1A1A1A",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        marginBottom: 0,
      },
      inputLabel: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "21px",
        color: "#1A1A1A",
        display: "flex",
        alignItems: "center" as "center",
        gap: "4px",
        marginBottom: "4px",
      },
      input: {
        width: "100%",
      },
      multilineInput: {
        width: "100%",
        "& .MuiOutlinedInput-root": {
          boxShadow: "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
          WebkitBoxShadow: "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
          "& textarea": {
            padding: "8px",
          },
        },
      },
      required: {
        color: errorColor(500),
        fontSize: "14px",
        lineHeight: "21px",
      },
      formContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
        width: "100%",
        flex: 1,
        minHeight: 0,
        overflowY: "auto" as "auto",
      },
      helperText: {
        fontFamily: "'Forma DJR UI', sans-serif",
        fontSize: "12px",
        lineHeight: "18px",
        color: "#718096",
        marginTop: "4px",
      },
    };
  }, [theme, primaryColor, secondColor, errorColor]);
  return {
    classes,
  };
};
export { useStyle };
