import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        height: "100%",
        width: "100%",
        backgroundColor: "#F6F6F6",
        position: "relative" as "relative",
      },
      sidebarWrapper: {
        position: "relative" as "relative",
        zIndex: 10,
      },
      sidebarWrapperMobile: {
        position: "fixed" as "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "85%",
        maxWidth: "320px",
        zIndex: 1001,
        backgroundColor: "#FFF",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.15)",
        animation: "slideInLeft 0.3s ease-out",
      },
      backdrop: {
        position: "fixed" as "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
        animation: "fadeIn 0.3s ease-out",
      },
      menuButton: {
        position: "fixed" as "fixed",
        top: 16,
        left: 16,
        zIndex: 100,
        backgroundColor: "#FFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        "&:hover": {
          backgroundColor: "#F9FAFB",
        },
      },
      mainContentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        flex: 1,
        height: "100%",
        overflow: "hidden",
      },
      priceWidgetContainer: {
        flex: 1,
        height: "100%",
        backgroundColor: "#f6f6f6",
        overflow: "auto",
      },
      // Initialization Screen Styles
      initializationContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        height: "80vh",
        width: "100%",
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      },
      initializationCard: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: "24px",
        padding: "40px",
        backgroundColor: "#FFF",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(236, 72, 153, 0.1)",
      },
      initializationCardMobile: {
        gap: "16px",
        padding: "24px 20px",
        borderRadius: "16px",
      },
      initializationLogo: {
        width: "80px",
        height: "80px",
        background: "linear-gradient(135deg, #9333ea, #ec4899)",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "ai-pulse 2s infinite",
        boxShadow: "0 8px 32px rgba(147, 51, 234, 0.3)",
      },
      initializationLogoMobile: {
        width: "60px",
        height: "60px",
        borderRadius: "14px",
      },
      initializationSpinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #FFF",
        borderTop: "3px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      },
      initializationSpinnerMobile: {
        width: "30px",
        height: "30px",
        border: "2px solid #FFF",
        borderTop: "2px solid transparent",
      },
      initializationTitle: {
        fontSize: "24px",
        fontWeight: "700",
        background: "linear-gradient(135deg, #9333ea, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center" as "center",
      },
      initializationTitleMobile: {
        fontSize: "18px",
      },
      initializationSubtitle: {
        fontSize: "16px",
        color: "#6B7280",
        textAlign: "center" as "center",
        maxWidth: "300px",
        lineHeight: "1.5",
      },
      initializationSubtitleMobile: {
        fontSize: "13px",
        maxWidth: "240px",
        lineHeight: "1.4",
      },
      initializationDotsContainer: {
        display: "flex",
        gap: "8px",
        alignItems: "center",
      },
      initializationDot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #9333ea, #ec4899)",
        animation: "ai-pulse 1.5s infinite",
      },
      initializationDotMobile: {
        width: "6px",
        height: "6px",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
