import { FONT_FAMILY } from "@/utils/font-family";
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

      labelStyle: {
        color: "#333",
        fontWeight: 600,
      },
      showMoreButton: {
        marginTop: 8,
        color: "#2E3092",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        ...FONT_FAMILY.Inter(500, 14),
        textTransform: "none" as "none",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
