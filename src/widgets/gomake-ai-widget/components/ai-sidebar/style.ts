import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH } from "@/utils/adapter";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({
  isCollapsed = false,
  isMobile = false,
}: {
  isCollapsed?: boolean;
  isMobile?: boolean;
}) => {
  const { secondColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      sidebarContainer: {
        width: isCollapsed ? 80 : 280,
        minWidth: isCollapsed ? 60 : 280,
        height: "100vh",
        backgroundColor: "#FFF",
        display: "flex",
        flexDirection: "column" as "column",
        padding: isCollapsed ? "20px 10px" : "20px",
        overflowY: "auto" as "auto",
        transition: "width 0.3s ease, min-width 0.3s ease, padding 0.3s ease",
        ...(isCollapsed && {
          justifyContent: "space-between",
        }),
      },
      header: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: convertHeightToVH(30),
        padding: "0px 0px 20px 0px",
        borderBottom: "1px solid #F3F4F6",

        ...(isCollapsed && {
          gap: "8px",
        }),
      },
      brandingContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 12,
        width: "100%",
      },
      refreshButton: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        marginLeft: "auto",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "12px",
        color: "#666",
        justifyContent: "center",
        gap: 4,
      },
      logoContainer: {
        background: "linear-gradient(135deg, #9333ea, #ec4899)", // pink gradient
        borderRadius: 16, // smoother round corners
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 24,
        minHeight: 24,
        // boxShadow: "0 6px 12px rgba(147, 51, 234, 0.35)", // pink shadow
      },
      chatIcon: {
        fontSize: 16,
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
      conversationCounter: {
        ...FONT_FAMILY.Inter(600, 12),
        color: "#495057",
        backgroundColor: "#d9d9d9",
        padding: "6px 12px",
        borderRadius: 6,
        display: "inline-block",
        textAlign: "center" as "center",
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
        gap: "8px",
        padding: "8px 12px",
        borderRadius: 12,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: "transparent",
        position: "relative" as "relative",
        overflow: "hidden",
        "&:hover": {
          backgroundColor: "#FDF2F8",
          transform: "translateX(4px)",
        },
      },
      activeNavItem: {
        backgroundColor: "#FDF2F8",
        border: "1px solid #FCE7F3",
        boxShadow: "0 2px 4px rgba(138, 236, 72, 0.1)",
        "&::before": {
          content: '""',
          position: "absolute" as "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: secondColor(500),
          borderRadius: "0 2px 2px 0",
        },
      },
      navIcon: {
        ...FONT_FAMILY.Inter(600, 16),
        color: secondColor(500),
        minWidth: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: "rgba(236, 72, 153, 0.1)",
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
        display: "flex",
        alignItems: "center",
        gap: 8,
      },
      sectionIcon: {
        fontSize: 16,
        color: "#374151",
      },
      jobHistoryList: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
      },
      scrollableList: {
        // maxHeight: "400px",
        maxHeight: "50vh",
        overflowY: "auto" as "auto",
        overflowX: "hidden" as "hidden",
        paddingRight: "4px",
        scrollbarWidth: "thin" as "thin",
        scrollbarColor: "#CBD5E0 #F7FAFC",
        // Webkit scrollbar styles
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#F7FAFC",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#CBD5E0",
          borderRadius: "3px",
          "&:hover": {
            background: "#A0AEC0",
          },
        },
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
        gap: isCollapsed ? 8 : 16,
        marginTop: "auto",
        paddingTop: isCollapsed ? 12 : 20,
        borderTop: "1px solid #F3F4F6",
        backgroundColor: "#FAFBFC",
        margin: isCollapsed
          ? "20px -10px -10px -10px"
          : "20px -20px -20px -20px",
        padding: isCollapsed ? "12px 10px 10px 10px" : "16px 20px 20px 20px",
      },
      navigationButtonsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        width: "100%",
      },
      navButton: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        backgroundColor: "#FFF",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        justifyContent: "flex-start",
        outline: "none",
      },
      navButtonIcon: {
        fontSize: 18,
        color: "#6B7280",
      },
      navButtonText: {
        ...FONT_FAMILY.Inter(500, 13),
        color: "#374151",
        letterSpacing: "-0.01em",
      },
      backButton: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 8,
        padding: "10px 20px",
        backgroundColor: "#FDF2F8",
        border: "1px solid #FCE7F3",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        width: "100%",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(236, 72, 153, 0.1)",
        outline: "none",
      },
      backButtonIcon: {
        fontSize: 18,
        color: "#EC4899",
      },
      backButtonText: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#EC4899",
        letterSpacing: "-0.01em",
      },
      poweredByContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: isMobile ? 6 : 8,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Inter(400, isMobile ? 9 : 11),
        color: "#9CA3AF",
        textTransform: "uppercase" as "uppercase",
        letterSpacing: "0.05em",
        marginBottom: isMobile ? 2 : 4,
      },
      toggleButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: "#F3F4F6",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#E5E7EB",
        },
      },
      toggleIcon: {
        fontSize: 18,
        color: "#6B7280",
      },
      // Collapsed footer styles
      collapsedFooter: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: 8,
        width: "100%",
      },
      collapsedNavButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        backgroundColor: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
      },
      collapsedNavButtonIcon: {
        fontSize: 16,
        color: "#6B7280",
      },
      collapsedBackButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        backgroundColor: "#FDF2F8",
        border: "1px solid #FCE7F3",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 3px rgba(75, 72, 236, 0.1)",
        outline: "none",
      },
      collapsedBackButtonIcon: {
        fontSize: 16,
        color: secondColor(500),
      },
      collapsedPoweredBy: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.7,
      },
    };
  }, [isCollapsed, isMobile , theme]);

  return {
    classes,
  };
};

export { useStyle };
