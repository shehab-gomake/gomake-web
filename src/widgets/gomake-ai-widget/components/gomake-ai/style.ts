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
      initializationSpinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #FFF",
        borderTop: "3px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      },
      initializationTitle: {
        fontSize: "24px",
        fontWeight: "700",
        background: "linear-gradient(135deg, #9333ea, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center" as "center",
      },
      initializationSubtitle: {
        fontSize: "16px",
        color: "#6B7280",
        textAlign: "center" as "center",
        maxWidth: "300px",
        lineHeight: "1.5",
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
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
