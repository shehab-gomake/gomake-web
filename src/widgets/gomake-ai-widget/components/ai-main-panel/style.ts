import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      bottomFormContainer: {
        position: "absolute" as "absolute",
        bottom: 24,
        left: 24,
        right: 24,
        backgroundColor: "#FFF",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      bottomFormWrapper: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center", // 👈 was flex-end
        padding: "8px 12px",
        gap: 12,
      },
      bottomTextArea: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        resize: "none" as "none", // 👈 no resize
        fontFamily: FONT_FAMILY.Inter(400, 14).fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        padding: "12px 16px",
        border: "none", // 👈 remove border
        borderRadius: 8,
        backgroundColor: "#FFF", // 👈 white inside
        outline: "none",
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
        "&::placeholder": {
          color: "#9CA3AF",
        },
      },
      sendButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        background: "#3B82F6", // 👈 solid blue
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "#2563EB", // darker blue hover
          transform: "translateY(-1px)",
        },
        "&:disabled": {
          background: "#D1D5DB",
          cursor: "not-allowed",
          transform: "none",
        },
      },
      sendIcon: {
        color: "#FFF",
        fontSize: 20,
        transform: "rotate(-15deg)",
      },

      mainPanelContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        height: "100vh",
        backgroundColor: "#e9f0f7",
        overflowY: "auto" as "auto",
      },
      newJobContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        padding: "24px",
        gap: 24,
        position: "relative" as "relative",
      },
      jobHistoryContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        padding: "24px",
        gap: 24,
      },
      header: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
      },
      headerIcon: {
        fontSize: 32,
        textAlign: "center" as "center",
        marginBottom: 16,
        color: "#3B82F6",
      },
      headerTitle: {
        ...FONT_FAMILY.Inter(600, 32),
        color: "#1F2937",
        textAlign: "center" as "center",
        marginBottom: 8,
      },
      headerSubtitle: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#6B7280",
        lineHeight: "24px",
        textAlign: "center" as "center",
      },
      formContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 24,
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: "24px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      formSection: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 12,
      },
      sectionTitle: {
        ...FONT_FAMILY.Inter(600, 16),
        color: "#1F2937",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
      },
      textArea: {
        minHeight: 120,
        height: 120,
        width: "100%",
        resize: "vertical" as "vertical",
        fontFamily: FONT_FAMILY.Inter(400, 14).fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        padding: "12px 16px",
        //!here
        // border: "1px solid #D1D5DB",
        // borderRadius: 8,
        // backgroundColor: "#FFF",
        "&:focus": {
          outline: "none",
          borderColor: "#504FA1",
          boxShadow: "0 0 0 3px rgba(80, 79, 161, 0.1)",
        },
        "&::placeholder": {
          color: "#9CA3AF",
        },
      },
      actionButtonsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        gap: 12,
      },
      submitButton: {
        minWidth: 180,
        height: 44,
        borderRadius: 8,
        ...FONT_FAMILY.Inter(500, 14),
        textTransform: "none" as "none",
      },
      chatContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: 90,
        //!here style
        // backgroundColor: "#FFF",
        // borderRadius: 12,
        // border: "1px solid #E5E7EB",
        overflow: "hidden",
      },
      historyContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
      },
      emptyState: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center" as "center",
        padding: "60px 40px",
      },
      emptyStateIcon: {
        ...FONT_FAMILY.Inter(500, 64),
        color: "#D1D5DB",
        marginBottom: 16,
      },
      emptyStateText: {
        ...FONT_FAMILY.Inter(600, 20),
        color: "#1F2937",
        marginBottom: 8,
      },
      emptyStateSubtext: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#6B7280",
        maxWidth: 400,
        lineHeight: "24px",
      },
      jobTypeCardsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(400px, 1fr))", // min 400px per card
        gap: 24,
        marginBottom: 24,
        maxWidth: 1200, // was 1000
        margin: "0 auto 24px auto",
      },
      jobTypeCard: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: "20px",
        border: "1px solid #E5E7EB",
        cursor: "pointer" as "pointer",
        transition: "all 0.2s ease",
        minHeight: 100,
        minWidth: 420, // 👈 force card to be wider
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center" as "center",
        gap: 16,
        "&:hover": {
          borderColor: "#3B82F6",
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
          transform: "translateY(-2px)",
        },
      },

      jobTypeTextContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        flex: 1,
      },
      jobTypeTitle: {
        ...FONT_FAMILY.Inter(600, 14),
        color: "#1F2937",
        marginBottom: 4,
        textAlign: "left" as "left",
      },
      jobTypeDescription: {
        ...FONT_FAMILY.Inter(400, 12),
        color: "#6B7280",
        lineHeight: "16px",
        textAlign: "left" as "left",
        flex: 1,
      },
      // bottomFormContainer: {
      //   position: "absolute" as "absolute",
      //   bottom: 24,
      //   left: 24,
      //   right: 24,
      //   backgroundColor: "#FFF",
      //   borderRadius: 12,
      //   border: "1px solid #E5E7EB",
      //   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      // },
      // bottomFormWrapper: {
      //   display: "flex",
      //   flexDirection: "row" as "row",
      //   alignItems: "flex-end",
      //   gap: 12,
      //   padding: "16px",
      // },
      // bottomTextArea: {
      //   flex: 1,
      //   minHeight: 40,
      //   maxHeight: 120,
      //   resize: "vertical" as "vertical",
      //   fontFamily: FONT_FAMILY.Inter(400, 14).fontFamily,
      //   fontSize: 14,
      //   lineHeight: "20px",
      //   padding: "12px 16px",
      //   border: "1px solid #D1D5DB",
      //   borderRadius: 8,
      //   backgroundColor: "#F9FAFB",
      //   outline: "none",
      //   "&:focus": {
      //     borderColor: "#504FA1",
      //     boxShadow: "0 0 0 3px rgba(80, 79, 161, 0.1)",
      //   },
      //   "&::placeholder": {
      //     color: "#9CA3AF",
      //   },
      // },
      // sendButton: {
      //   width: 48,
      //   height: 48,
      //   borderRadius: 8,
      //   background: "linear-gradient(135deg, #2E54E7 0%, #4C8CFF 100%)",
      //   border: "none",
      //   cursor: "pointer",
      //   display: "flex",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   transition: "all 0.2s ease",
      //   "&:hover": {
      //     background: "linear-gradient(135deg, #1E44D7 0%, #3A7CFF 100%)",
      //     transform: "translateY(-1px)",
      //   },
      //   "&:disabled": {
      //     background: "#D1D5DB",
      //     cursor: "not-allowed",
      //     transform: "none",
      //   },
      // },
      sendButtonDisabled: {
        backgroundColor: "#D1D5DB",
        cursor: "not-allowed",
      },
      // sendIcon: {
      //   color: "#FFF",
      //   fontSize: 20,
      //   transform: "rotate(-15deg)",
      //   fontStyle: "italic",
      // },
      jobTypeIconWrapper: {
        display: "flex",
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
        width: "44px",
        height: "44px",
        borderRadius: "8px",
        backgroundColor: "#e9f0f7",
        flexShrink: 0,
      },

      jobTypeIcon: {
        fontSize: "26px",
        color: "#2E54E7", // same blue as the theme
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
