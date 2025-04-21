import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "30px",
        minHeight: "85vh",
      },
      SkeletonCardsContainer: {
        width: "100%",
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        borderRadius: "20px",
        border: "1px solid #F8F9FA",
      },
      // !here new should fix
      SkeletonChartContainer: {},
      subContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        border: "1px solid #F8F9FA",
      },
      chartHeader: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
      },

      secSubContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        flexWrap: "wrap" as "wrap",
        gap: "32px",
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.5)",
        border: "1px solid #F8F9FA",
        justifyContent: "space-between",
        alignItems: "flex-start",
      },
      piesContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
        flex: 1,
        minWidth: "300px",
        maxWidth: "35vw",
        alignItems: "center",
      },
      labelStyle: {
        color: "#333",
        fontWeight: 600,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
