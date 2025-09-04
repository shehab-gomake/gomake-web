import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      // Main container styles
      mainContainer: {
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
      },

      // Header section styles
      headerContainer: {
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E9ECEF",
        padding: "12px 24px",
      },

      headerContent: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
      },

      // Date Selector styles
      dateSelector: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        borderRadius: "8px",
        padding: "8px 16px",
        gap: "16px",
        color: "#6C757D",
        backgroundColor: "rgba(108, 117, 125, 0.04)",
        border: "1px solid #6C757D",
      },

      dateSelectorButton: {
        color: "#6C757D",
        "&:hover": {
          backgroundColor: "rgba(108, 117, 125, 0.1)",
        },
      },

      dateLabel: {
        color: "#6C757D",
        fontWeight: 500,
        fontSize: "16px",
        minWidth: "180px",
        textAlign: "center" as const,
      },

      // Tabs styles
      tabsContainer: {
        direction: "row",
        backgroundColor: "#2e3092",
        borderRadius: "8px",
        padding: "4px",
        gap: "2px",
        boxShadow: "0 2px 8px rgba(46, 48, 146, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      },

      tabButton: (isActive: boolean) => ({
        color: isActive ? "#2e3092" : "white",
        backgroundColor: isActive ? "white" : "transparent",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: 600,
        textTransform: "none" as const,
        minWidth: "auto",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: isActive ? "white" : "rgba(255, 255, 255, 0.1)",
          transform: "translateY(-1px)",
        },
        "& .MuiButton-startIcon": {
          marginRight: "8px",
        },
        "& .MuiSvgIcon-root": {
          color: isActive ? "#2e3092" : "white",
        },
      }),

      tabIcon: {
        fontSize: "18px",
      },

      // Action buttons styles
      actionButtonsContainer: {
        direction: "row",
        gap: 1,
      },

      addJobButton: {
        backgroundColor: "#28A745",
        "&:hover": { backgroundColor: "#218838" },
        textTransform: "none",
        fontWeight: 600,
      },

      autoScheduleButton: {
        backgroundColor: "#FD7E14",
        "&:hover": { backgroundColor: "#E8690B" },
        textTransform: "none",
        fontWeight: 600,
      },

      saveButton: {
        borderColor: "#2e3092",
        color: "#2e3092",
        "&:hover": {
          borderColor: "#1a1b5e",
          backgroundColor: "rgba(46, 48, 146, 0.04)",
        },
        textTransform: "none",
        fontWeight: 600,
      },

      resetButton: {
        borderColor: "#6C757D",
        color: "#6C757D",
        "&:hover": {
          borderColor: "#495057",
          backgroundColor: "rgba(108, 117, 125, 0.04)",
        },
        textTransform: "none",
        fontWeight: 600,
      },

      // Timeline content styles
      timelineContainer: {
        padding: "24px",
        flex: 1,
      },

      timelineWrapper: {
        position: "relative",
        direction: "ltr",
      },

      // Zoom controls styles
      zoomControls: {
        alignItems: "center",
        direction: "row",
        position: "absolute",
        right: "0px",
        top: "0px",
        zIndex: 99999,
        height: "60px",
        background: "#fff",
        borderRadius: "8px",
        padding: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },

      zoomIcon: {
        height: "20px",
        width: "20px",
        cursor: "pointer",
        transition: "color 0.2s ease",
      },

      zoomInIcon: {
        color: "#2e3092",
        "&:hover": {
          color: "#1a1b5e",
        },
      },

      zoomOutIcon: {
        color: "#6C757D",
        "&:hover": {
          color: "#495057",
        },
      },

      // Current time indicator styles
      currentTimeIndicator: (position: number) => ({
        position: "absolute",
        left: `${position}%`,
        top: 0,
        bottom: 0,
        width: "2px",
        backgroundColor: "#DC3545",
        zIndex: 1000,
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-8px",
          left: "-4px",
          width: "10px",
          height: "10px",
          backgroundColor: "#DC3545",
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(220, 53, 69, 0.4)",
        },
      }),

      // Timeline styles
      timeline: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      },

      // Sidebar header styles
      sidebarHeader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "280px",
        padding: "16px 20px",
        backgroundColor: "#F8F9FA",
        borderBottom: "2px solid #E9ECEF",
        borderRight: "2px solid #E9ECEF",
        color: "#495057",
      },

      // Group styles
      groupContainer: (isOpen: boolean) => ({
        bgcolor: isOpen ? "#F8F9FA" : "#FFF",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #E9ECEF",
        color: "#495057",
        "&:hover": {
          backgroundColor: "#F8F9FA",
          borderColor: "#2e3092",
        },
        transition: "all 0.2s ease-in-out",
      }),

      groupContent: {
        direction: "row",
        alignItems: "center",
        gap: 1,
      },

      groupArrow: {
        color: "#6C757D",
        fontSize: 20,
      },

      groupColorDot: (color: string) => ({
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
      }),

      groupChip: (color: string) => ({
        backgroundColor: color,
        color: "white",
        fontSize: "11px",
        height: "20px",
        fontWeight: 600,
      }),

      groupStats: {
        direction: "row",
        alignItems: "center",
        gap: 1,
      },

      groupStatsText: {
        color: "#6C757D",
        fontSize: "11px",
      },

      groupBadge: {
        "& .MuiBadge-badge": {
          backgroundColor: "#FD7E14",
          color: "white",
          fontSize: "10px",
        },
      },

      groupBadgeDot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "#FD7E14",
      },

      // Station styles
      stationContainer: {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px 8px 32px",
        backgroundColor: "#FFF",
        borderBottom: "1px solid #F1F3F4",
        color: "#495057",
        "&:hover": {
          backgroundColor: "#F8F9FA",
        },
        transition: "background-color 0.2s ease",
      },

      stationChip: {
        backgroundColor: "#E9ECEF",
        color: "#495057",
        fontSize: "11px",
        height: "20px",
        fontWeight: 600,
      },

      // Empty state styles
      emptyState: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#7A7A7A",
        textAlign: "center" as const,
        padding: "20px",
        borderRadius: "8px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
