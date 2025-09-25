import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        backgroundColor: "#fff",
        //backgroundColor: "#f8f9fa"
        height: "85vh",
        display: "flex",
        flexDirection: "column" as const,
      },
      header: {
        textAlign: "center" as const,
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px 0",
        flexShrink: 0,
        backgroundColor: "#fff",
        //backgroundColor: "#f8f9fa"
        zIndex: 10,
      },
      title: {
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: "12px",
        fontFamily: "Outfit, sans-serif",
      },
      subtitle: {
        fontSize: "1rem",
        color: "#666",
        lineHeight: "1.6",
        fontFamily: "Inter, sans-serif",
      },
      pricingContainer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        flex: 1,
        overflow: "auto",
        padding: "0 20px 20px 20px",
      },
      pricingTable: {
        //width: "75%",
        width: "100%",
        backgroundColor: "white",
        //backgroundColor: "#f8f9fa"
        borderRadius: "12px",
        // boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        maxHeight: "calc(85vh - 100px)",
        overflow: "auto",
      },
    };
  }, [theme, primaryColor, secondColor]);

  return {
    classes,
  };
};

export { useStyle };
