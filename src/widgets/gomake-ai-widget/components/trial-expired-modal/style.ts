import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      iconContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "16px",
      },
      icon: {
        width: { xs: "54px", sm: "65px" },
        height: { xs: "54px", sm: "65px" },
        borderRadius: "50%",
        background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(147, 51, 234, 0.15)",
      },
      titleContainer: {
        textAlign: "center" as const,
        marginBottom: "8px",
      },
      title: {
        fontSize: { xs: "22px", sm: "28px" },
        fontWeight: "700",
        color: "#1a1a1a",
        marginBottom: { xs: "8px", sm: "12px" },
        lineHeight: "1.3",
      },
      subtitle: {
        fontSize: { xs: "13px", sm: "15px" },
        fontWeight: "400",
        color: "#6b7280",
        lineHeight: "1.6",
        maxWidth: "450px",
        margin: "0 auto",
        padding: { xs: "0 8px", sm: "0" },
      },
      featuresContainer: {
        width: "100%",
        padding: { xs: "16px", sm: "20px" },
        backgroundColor: "#fafafa",
        borderRadius: { xs: "8px", sm: "12px" },
        marginTop: "8px !important",
      },
      featureItem: {
        fontSize: { xs: "14px", sm: "15px" },
        fontWeight: "500",
        color: "#374151",
        marginBottom: { xs: "8px", sm: "10px" },
        display: "flex",
        alignItems: "center",
      },
      label: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        display: "block",
      },
      required: {
        color: "#ef4444",
        marginLeft: "2px",
      },
      input: {
        width: "100%",
        marginTop: "8px",
      },
      errorText: {
        fontSize: "13px",
        color: "#ef4444",
        marginTop: "6px",
        fontWeight: "500",
      },
      upgradeButton: {
        width: { xs: "100%", sm: "50%" },
        "& button": {
          height: { xs: "44px", sm: "48px" },
          fontSize: { xs: "15px", sm: "16px" },
          fontWeight: "600",
          borderRadius: "8px",
          textTransform: "none",
        },
      },
      cancelButton: {
        width: { xs: "100%", sm: "50%" },
        "& button": {
          height: { xs: "44px", sm: "48px" },
          fontSize: { xs: "15px", sm: "16px" },
          fontWeight: "600",
          borderRadius: "8px",
          textTransform: "none",
          borderColor: "#e5e7eb",
          color: "#6b7280",
        },
      },
    };
  }, [theme, primaryColor]);

  return { classes };
};

export { useStyle };
