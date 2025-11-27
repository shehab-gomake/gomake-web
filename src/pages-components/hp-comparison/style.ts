import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 24,
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      },
      header: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 12,
        width: "100%",
      },
      title: {
        ...FONT_FAMILY.Lexend(700, 32),
        color: primaryColor(900),
      },
      subtitle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: neutralColor(600),
      },
      metaInfo: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
      },
      pill: {
        padding: "6px 12px",
        borderRadius: "16px",
        backgroundColor: primaryColor(50),
        color: primaryColor(700),
        ...FONT_FAMILY.Lexend(500, 12),
      },
      cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20,
        width: "100%",
      },
      card: {
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${neutralColor(200)}`,
        display: "flex",
        flexDirection: "column" as "column",
        gap: 8,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      },
      cardHover: {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      cardLabel: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: neutralColor(600),
        textTransform: "uppercase" as "uppercase",
        letterSpacing: "0.5px",
      },
      cardValue: {
        ...FONT_FAMILY.Lexend(700, 28),
        color: primaryColor(900),
      },
      cardSubtext: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: neutralColor(500),
        marginTop: 4,
      },
      cardPositive: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#ffffff",
      },
      cardPositiveLabel: {
        color: "rgba(255, 255, 255, 0.9)",
      },
      cardPositiveValue: {
        color: "#ffffff",
      },
      wastePanel: {
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#f9fafb",
        border: `1px solid ${neutralColor(200)}`,
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        width: "100%",
      },
      wasteRow: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      },
      wasteLabel: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(700),
        minWidth: "200px",
      },
      wasteBarContainer: {
        flex: 1,
        height: "24px",
        backgroundColor: neutralColor(200),
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative" as "relative",
      },
      wasteBar: {
        height: "100%",
        borderRadius: "12px",
        transition: "width 0.3s ease",
      },
      wasteBarClient: {
        backgroundColor: "#ef4444",
      },
      wasteBarHp: {
        backgroundColor: "#10b981",
      },
      wastePercent: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: neutralColor(900),
        minWidth: "60px",
        textAlign: "right" as "right",
      },
      tabsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 8,
        borderBottom: `2px solid ${neutralColor(200)}`,
        width: "100%",
      },
      tab: {
        padding: "12px 24px",
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
        cursor: "pointer",
        borderBottom: "2px solid transparent",
        marginBottom: "-2px",
        transition: "all 0.2s",
      },
      tabActive: {
        color: primaryColor(700),
        borderBottomColor: primaryColor(700),
      },
      tabContent: {
        padding: "24px 0",
        width: "100%",
      },
      tableContainer: {
        width: "100%",
        overflowX: "auto" as "auto",
      },
      filtersContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 16,
        marginBottom: 16,
        flexWrap: "wrap" as "wrap",
      },
      filterInput: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: `1px solid ${neutralColor(300)}`,
        ...FONT_FAMILY.Lexend(400, 14),
        minWidth: "200px",
      },
      filterSelect: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: `1px solid ${neutralColor(300)}`,
        ...FONT_FAMILY.Lexend(400, 14),
        minWidth: "150px",
      },
      badge: {
        padding: "4px 8px",
        borderRadius: "6px",
        ...FONT_FAMILY.Lexend(600, 11),
        textTransform: "uppercase" as "uppercase",
      },
      badgeHp: {
        backgroundColor: "#10b981",
        color: "#ffffff",
      },
      badgePositive: {
        color: "#10b981",
        fontWeight: 600,
      },
      badgeNegative: {
        color: "#ef4444",
        fontWeight: 600,
      },
      loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        width: "100%",
      },
      errorContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "400px",
        width: "100%",
        gap: 16,
      },
      errorText: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#ef4444",
      },
      summaryText: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: neutralColor(700),
        lineHeight: "1.6",
        marginBottom: 24,
      },
      chartContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: `1px solid ${neutralColor(200)}`,
      },
      chartBar: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 12,
      },
      chartLabel: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(700),
        minWidth: "200px",
      },
      chartBarContainer: {
        flex: 1,
        height: "32px",
        backgroundColor: neutralColor(200),
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative" as "relative",
      },
      chartBarFill: {
        height: "100%",
        backgroundColor: primaryColor(600),
        borderRadius: "8px",
        transition: "width 0.5s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: "8px",
      },
      chartPercent: {
        ...FONT_FAMILY.Lexend(600, 12),
        color: "#ffffff",
      },
    };
  }, [t, primaryColor, neutralColor]);

  return { classes };
};

export { useStyle };

