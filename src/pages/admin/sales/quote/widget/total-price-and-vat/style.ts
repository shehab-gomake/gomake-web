import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        paddingLeft: 33,
        paddingRight: 60,
        gap: 65,
        marginTop: 25,
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 16,
        width: "47%",
      },
      rightSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 18,
        width: "53%",
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
        height: 110,
        overflow: "scroll",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 16,
      },
      btnStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ED028C",
        borderRadius: 4,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#ED028C",
        cursor: "pointer",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
