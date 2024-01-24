import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        gap:"16px"
      },
      headerStyle: {
        ...FONT_FAMILY.Inter(500, 14),
        lineHeight: "20px",
        color: "#344054",
        padding:"0px 10px"
      },
      inputStyle: {
        height:"40px",
        width: "272px",
        borderRadius: "8px",
        border: "1px solid #D0D5DD",
        color: "#667085",
        boxShadow:"none",
        ...FONT_FAMILY.Inter(400, 16),
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
