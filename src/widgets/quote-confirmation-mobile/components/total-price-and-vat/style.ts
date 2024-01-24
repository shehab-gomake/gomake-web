import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      },
      secondContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "280px",
        marginTop: "10px",
        borderRadius: "8px"
      },
      tableHeader: {
        width: "50%",
        background: "#F2F4F7",
        display: "flex",
       // justifyContent: "center",
        alignItems: "center",
      },
      tableCell: {
        width: "50%"
      },
      inputStyle: {
        width: "100%",
        boxShadow: "none",
        ...FONT_FAMILY.Inter(400, 14),
        lineHeight: "20px"
      },

      inputPriceStyle: {
        width: "100%",
        boxShadow: "none",
        ...FONT_FAMILY.Inter(600, 14),
        lineHeight: "20px",
        color: "#F135A3"
      },
      firstDiv: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%", border: "2px solid #EAECF0",
        borderRadius: "8px 8px 0px 0px",
        justifyContent: "center",
      },
      secondDiv: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        borderBottom: "2px solid #EAECF0",
        borderLeft: "2px solid #EAECF0",
        borderRight: "2px solid #EAECF0"
      },
      thirdDiv: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        borderLeft: "2px solid #EAECF0",
        borderRight: "2px solid #EAECF0"
      },
      fourthDiv: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        border: "2px solid #EAECF0",
        borderRadius: "0px 0px 8px 8px"
      },
      headerStyle: {
        ...FONT_FAMILY.Inter(500, 14),
        lineHeight: "20px",
        color: "#344054",
        padding: "0px 15px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };