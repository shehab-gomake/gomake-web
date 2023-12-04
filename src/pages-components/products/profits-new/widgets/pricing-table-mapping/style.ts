import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 11,
      },
      cardItemWithMore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "10px 16px",
        backgroundColor: "#F8FAFB",
        marginBottom: 6,
        borderRadius: 16,
      },
      emptyStyle: { width: 14, height: 24 },
      sortStyle: { cursor: "pointer" },
      moreIconStyle: {
        cursor: "pointer",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
