import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer: { marginTop: 5, marginLeft: -25 },
      bodyContainer: { minWidth: 236, padding: "10px 15px" },
      menuTabStyle: {
        padding: "5px 0px",
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
