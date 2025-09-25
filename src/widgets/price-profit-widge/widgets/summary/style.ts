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
        padding: "0px 16px 8px 16px",
        "&:last-child": {
          paddingBottom: "12px",
        },
      },
      title: {
        marginBottom: "16px",
        fontWeight: 600,
        color: "#333333",
      },
      metricContainer: {
        textAlign: "center" as "center",
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e9ecef",
      },
      metricLabel: {
        color: "#6c757d",
        marginBottom: "4px",
        fontWeight: 500,
        fontSize: "0.78rem",
      },
      metricValue: {
        fontWeight: 700,
        fontSize: "1rem",
        color: "#212529",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
