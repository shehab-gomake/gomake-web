import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      pageContainer: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)",
        padding: "60px 20px",
      },
      headerSection: {
        textAlign: "center" as const,
        marginBottom: "40px",
      },
      title: {
        fontSize: "42px",
        fontWeight: "800",
        color: "#1a1a1a",
        marginBottom: "16px",
        background: "linear-gradient(135deg, #9333ea 0%, #c084fc 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      },
      subtitle: {
        fontSize: "18px",
        fontWeight: "400",
        color: "#6b7280",
        marginTop: "8px",
      },
      featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        width: "100%",
        marginBottom: "40px",
      },
      featureCard: {
        backgroundColor: "#ffffff",
        padding: "32px 24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        textAlign: "center" as const,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(147, 51, 234, 0.15)",
        },
      },
      featureIcon: {
        fontSize: "48px",
        marginBottom: "16px",
      },
      featureTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: "8px",
      },
      featureDescription: {
        fontSize: "14px",
        fontWeight: "400",
        color: "#6b7280",
        lineHeight: "1.5",
      },
      pricingSection: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      },
      pricingTable: {
        width: "100%",
        minHeight: "500px",
      },
    };
  }, [theme, primaryColor]);

  return { classes };
};

export { useStyle };
