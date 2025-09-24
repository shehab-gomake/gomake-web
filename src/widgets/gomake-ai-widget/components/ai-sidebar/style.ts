import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      sidebarContainer: {
        width: 280,
        minWidth: 280,
        height: "100vh",
        backgroundColor: "#FFF",
        display: "flex",
        flexDirection: "column" as "column",
        padding: "20px",
        overflowY: "auto" as "auto",
      },
      header: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        marginBottom: convertHeightToVH(30),
        padding: "20px 0",
        borderBottom: "1px solid #F3F4F6",
      },
      brandingContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
      },

      logoContainer: {
        background: "linear-gradient(135deg, #2E54E7 0%, #4C8CFF 100%)", // gradient
        borderRadius: 16, // smoother round corners
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 24,
        minHeight: 24,
        boxShadow: "0 6px 12px rgba(46, 84, 231, 0.35)", // stronger shadow
      },
      chatIcon: {
        fontSize: 20,
        color: "#FFF",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
      },
      brandingText: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 2,
      },
      brandTitle: {
        ...FONT_FAMILY.Inter(700, 16),
        color: "#1F2937",
        lineHeight: "22px",
        letterSpacing: "-0.02em",
      },
      brandSubtitle: {
        ...FONT_FAMILY.Inter(400, 11),
        color: "#6B7280",
        lineHeight: "16px",
        letterSpacing: "0.01em",
      },
      navigationContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        // marginBottom: convertHeightToVH(30),
      },
      navItem: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: convertWidthToVW(12),
        padding: "8px 12px",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: "transparent",
        position: "relative" as "relative",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "#F8FAFC",
          transform: "translateX(4px)",
        },
      },
      activeNavItem: {
        backgroundColor: "#EFF6FF",
        border: "1px solid #DBEAFE",
        boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)",
        "&::before": {
          content: '""',
          position: "absolute" as "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: "#3B82F6",
          borderRadius: "0 2px 2px 0",
        },
      },
      navIcon: {
        ...FONT_FAMILY.Inter(600, 16),
        color: "#3B82F6",
        minWidth: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
      navText: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#1F2937",
        letterSpacing: "-0.01em",
      },
      contentContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        overflowY: "auto" as "auto",
      },
      jobHistorySection: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        padding: "20px 0",
        borderTop: "1px solid #F3F4F6",
        marginTop: 20,
      },
      sectionTitle: {
        ...FONT_FAMILY.Inter(600, 14),
        color: "#374151",
        marginBottom: 12,
        textTransform: "uppercase" as "uppercase",
        letterSpacing: "0.05em",
        fontSize: 12,
      },
      jobHistoryList: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
      },
      emptyState: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        textAlign: "center" as "center",
        backgroundColor: "#F8FAFC",
        borderRadius: 12,
        border: "1px dashed #D1D5DB",
        marginTop: 8,
      },
      emptyStateIcon: {
        ...FONT_FAMILY.Inter(500, 32),
        color: "#9CA3AF",
        marginBottom: 12,
        opacity: 0.7,
      },
      emptyStateText: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#374151",
        marginBottom: 4,
      },
      emptyStateSubtext: {
        ...FONT_FAMILY.Inter(400, 12),
        color: "#6B7280",
        lineHeight: "16px",
      },
      footer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: 8,
        marginTop: "auto",
        paddingTop: 20,
        borderTop: "1px solid #F3F4F6",
        backgroundColor: "#FAFBFC",
        margin: "20px -20px -20px -20px",
        padding: "16px 20px 20px 20px",
      },
      poweredByLbl: {
        ...FONT_FAMILY.Inter(400, 11),
        color: "#9CA3AF",
        textTransform: "uppercase" as "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 4,
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
