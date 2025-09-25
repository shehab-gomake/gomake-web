import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, secondColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      // Main container styles
      mainContainer: {
        height: "75vh",
        display: "flex",
        flexDirection: "column" as "column",
        position: "relative" as "relative",
        overflow: "hidden" as "hidden",
      },
      headerContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexShrink: 0,
      },
      titleContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      pageTitle: {
        fontSize: "24px",
        fontWeight: "bold",
        margin: 0,
      },
      helpIcon: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "#2e3092",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
      },
      statusAndDownloadContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      downloadButton: {
        width: "fit-content" as "fit-content",
        borderRadius: "20px",
      },
      statusDisplay: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "15px",
        fontWeight: "500",
      },
      statusDot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        display: "inline-block",
        marginLeft: "8px",
        verticalAlign: "middle",
      },
      scrollableContent: {
        flex: 1,
        overflow: "hidden" as "hidden",
        display: "flex",
        flexDirection: "column" as "column",
      },
      contentContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        padding: "0 4px",
        flex: 1,
        overflow: "hidden" as "hidden",
      },
      authKeyContainer: {
        padding: "12px",
        backgroundColor: "#F8F9FA",
        borderRadius: "6px",
        border: "1px solid #E9ECEF",
        maxWidth: "1200px",
      },
      authKeyHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "8px",
      },
      authKeyTitle: {
        fontSize: "14px",
        fontWeight: "600",
        margin: 0,
        color: "#495057",
      },
      copyButton: {
        width: "fit-content" as "fit-content",
        fontSize: "13px",
        padding: "3px 8px",
        minWidth: "auto",
        height: "24px",
        transition: "all 0.2s ease-in-out",
      },
      authKeyValue: {
        backgroundColor: "#FFFFFF",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #DEE2E6",
        fontFamily: "monospace",
        fontSize: "13px",
        color: "#495057",
        wordBreak: "break-all" as "break-all",
        userSelect: "all" as "all",
      },
      submitButtonContainer: {
        marginTop: "24px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "20px",
      },
      fixedSubmitButtonContainer: {
        position: "fixed" as "fixed",
        bottom: "20px",
        // right: "20px",
        backgroundColor: "#FFFFFF",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        border: "1px solid #E5E7EB",
        zIndex: 1000,
      },
      submitButton: {
        width: "fit-content" as "fit-content",
      },
      // HotFolder array input styles
      container: {
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "hidden" as "hidden",
      },
      inputsRow: {
        display: "flex",
        alignItems: "center" as "center",
        gap: "16px",
        flexWrap: "wrap" as "wrap",
      },
      inputs: {
        boxSizing: "border-box" as "border-box",
        borderRadius: "4px",
        height: "40px",
        padding: "6.5px 14px",
      },
      button: {
        width: "fit-content" as "fit-content",
        height: "40px",
        borderRadius: "16px",
      },
      deleteIcon: {
        cursor: "pointer",
        alignSelf: "flex-end",
      },
      addColor: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        gap: 3,
      },
      input: {},
      multiInputLabel: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
      },
      multiInputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        width: "100%",
      },
      iconColor: secondColor(500),
      required: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      hotfolderItemContainer: {
        marginTop: "16px",
      },
      hotfolderLabel: {
        fontSize: "16px",
        fontWeight: "600",
        margin: "0 0 16px 0",
        color: "#374151",
        borderBottom: "1px solid #E5E7EB",
        paddingBottom: "8px",
      },
      hotfolderInputsRow: {
        display: "flex",
        alignItems: "center" as "center",
        gap: "16px",
        flexWrap: "wrap" as "wrap",
        paddingTop: 0,
      },
      stickyButtonContainer: {
        position: "sticky" as "sticky",
        top: 0,
        zIndex: 10,
        marginBottom: "16px",
        display: "flex",
        justifyContent: "flex-start",
      },
      scrollableTransitionGroup: {
        flex: 1,
        overflowY: "auto" as "auto",
        paddingRight: "8px",
        minHeight: 0, // Important for flex child to shrink
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
