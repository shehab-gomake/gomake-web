import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ isFullWidth = false }: { isFullWidth?: boolean } = {}) => {
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
        alignItems: "center",
        padding: "8px 12px",
        gap: 12,
      },
      bottomTextArea: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        resize: "none" as "none",
        fontFamily: FONT_FAMILY.Inter(400, 14).fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        padding: "12px 16px",
        border: "none",
        borderRadius: 8,
        backgroundColor: "#FFF",
        outline: "none",
        "&:focus": {
          outline: "none",
          boxShadow: "none",
        },
        "&::placeholder": {
          color: "#9CA3AF",
        },
      },
      bottomTextAreaMobile: {
        fontSize: 12,
        padding: "10px 12px",
        minHeight: 40,
      },
      sendButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        background: "linear-gradient(135deg, #9333ea, #ec4899)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        "&:hover": {
          background: "linear-gradient(135deg, #7c3aed, #db2777)",
          transform: "translateY(-1px)",
        },
        "&:disabled": {
          background: "#D1D5DB",
          cursor: "not-allowed",
          transform: "none",
        },
      },
      sendButtonMobile: {
        width: 40,
        height: 40,
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
        backgroundColor: "#f8f9fa",
        overflowY: "auto" as "auto",
        ...(isFullWidth
          ? {
              maxWidth: "100%", // Full width when no productId
              borderRight: "none", // No border when full width
            }
          : {
              borderRight: "1px solid #E5E7EB", // Border when split layout
            }),
      },
      newJobContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        padding: "24px",
        gap: 24,
        position: "relative" as "relative",
      },
      newJobContainerMobile: {
        padding: "16px 12px",
        gap: 16,
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
        textAlign: "center" as "center",
        marginBottom: 8,
        color: "#ed028c",
      },
      headerTitle: {
        ...FONT_FAMILY.Inter(600, 32),
        color: "#1F2937",
        textAlign: "center" as "center",
        marginBottom: 8,
      },
      headerTitleMobile: {
        fontSize: 18,
        marginBottom: 6,
      },
      headerSubtitle: {
        ...FONT_FAMILY.Inter(400, 16),
        color: "#6B7280",
        lineHeight: "24px",
        textAlign: "center" as "center",
      },
      headerSubtitleMobile: {
        fontSize: 12,
        lineHeight: "20px",
        padding: "0 8px",
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

        "&:focus": {
          outline: "none",
          borderColor: "#ed028c",
          boxShadow: "0 0 0 3px rgba(237, 2, 140, 0.1)",
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
        overflow: "hidden",
      },
      chatContainerMobile: {
        marginBottom: 80,
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
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24,
        marginBottom: 24,
        width: "100%",
        maxWidth: 1000,
        margin: "0 auto 24px auto",
      },
      jobTypeCardsContainerMobile: {
        gridTemplateColumns: "1fr",
        gap: 12,
        marginBottom: 16,
      },
      jobTypeCard: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid #E5E7EB",
        cursor: "pointer" as "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        minHeight: 120,
        width: "100%",
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center" as "center",
        gap: 20,
        position: "relative" as "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "#ed028c",
          boxShadow: "0 8px 25px rgba(236, 72, 153, 0.15)",
          transform: "translateY(-4px) scale(1.02)",
          backgroundColor: "#FDF2F8",
        },
        "&:active": {
          transform: "translateY(-2px) scale(1.01)",
          transition: "all 0.1s ease",
        },
      },
      jobTypeCardMobile: {
        borderRadius: 10,
        padding: "12px 14px",
        minHeight: 70,
        gap: 12,
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
      jobTypeTitleMobile: {
        fontSize: 12,
        marginBottom: 2,
      },
      jobTypeDescription: {
        ...FONT_FAMILY.Inter(400, 12),
        color: "#6B7280",
        lineHeight: "16px",
        textAlign: "left" as "left",
        flex: 1,
      },
      jobTypeDescriptionMobile: {
        fontSize: 10,
        lineHeight: "13px",
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

      sendButtonDisabled: {
        backgroundColor: "#D1D5DB",
        cursor: "not-allowed",
      },

      jobTypeIconWrapper: {
        display: "flex",
        alignItems: "center" as "center",
        justifyContent: "center" as "center",
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
        border: "1px solid rgba(236, 72, 153, 0.1)",
        flexShrink: 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative" as "relative",
        overflow: "hidden",
        "&:hover": {
          background: "linear-gradient(135deg, #fce7f3, #f9a8d4)",
          transform: "scale(1.1) rotate(5deg)",
          boxShadow: "0 4px 12px rgba(236, 72, 153, 0.2)",
        },
      },
      jobTypeIconWrapperMobile: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
      },

      jobTypeIcon: {
        fontSize: "26px",
        color: "#ed028c", // pink theme
      },
      loadingOverlay: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "#FFF",
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        height: "100%",
      },
    };
  }, [isFullWidth]);

  return {
    classes,
  };
};

export { useStyle };
