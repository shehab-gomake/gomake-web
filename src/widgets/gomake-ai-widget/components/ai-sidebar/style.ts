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
        alignItems: "center",
        marginBottom: convertHeightToVH(30),
      },
      logoContainer: {
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
      },
      title: {
        ...FONT_FAMILY.Inter(600, 20),
        color: "#1F2937",
        textAlign: "center" as "center",
      },
      navigationContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        marginBottom: convertHeightToVH(30),
      },
      navItem: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: convertWidthToVW(12),
        padding: "12px 16px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        backgroundColor: "transparent",
      },
      activeNavItem: {
        backgroundColor: "#F3F4F6",
        border: "1px solid #E5E7EB",
      },
      navIcon: {
        ...FONT_FAMILY.Inter(500, 16),
        color: "#3B82F6",
        minWidth: 20,
      },
      navText: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#1F2937",
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
      },
      sectionTitle: {
        ...FONT_FAMILY.Inter(600, 16),
        color: "#1F2937",
        marginBottom: 8,
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
        padding: "40px 20px",
        textAlign: "center" as "center",
      },
      emptyStateIcon: {
        ...FONT_FAMILY.Inter(500, 48),
        color: "#9CA3AF",
        marginBottom: 16,
      },
      emptyStateText: {
        ...FONT_FAMILY.Inter(500, 16),
        color: "#1F2937",
        marginBottom: 8,
      },
      emptyStateSubtext: {
        ...FONT_FAMILY.Inter(400, 14),
        color: "#6B7280",
      },
      footer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        gap: 8,
        marginTop: "auto",
        paddingTop: 20,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#6B7280",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
