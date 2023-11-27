import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer: { marginTop: -10, marginLeft: -252 },
      bodyContainer: { minWidth: 236, padding: "2px 10px" },
      menuTabStyle: {
        padding: "8px 10px",
        ...FONT_FAMILY.Lexend(500, 10),
        color: "#8283BE",
        cursor: "pointer",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
