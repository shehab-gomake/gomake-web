import { useMemo } from "react";
const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        // marginBottom: "16px",
        width: "100%",
      },
      card: {
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      },
      cardContent: {
        width: "100%",
        padding: "20px 30px",
        "&:last-child": {
          paddingBottom: "20px",
        },
      },
      title: {
        marginBottom: "16px",
        fontWeight: 600,
        color: "#333333",
      },
      metricContainer: {
        textAlign: "center" as "center",
        padding: "12px",
        borderRadius: "6px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
      },
      metricLabel: {
        color: "#6c757d",
        marginBottom: "8px",
        fontWeight: 500,
        fontSize: "0.875rem",
      },
      metricValue: {
        fontWeight: 700,
        fontSize: "1.25rem",
        color: "#212529",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
