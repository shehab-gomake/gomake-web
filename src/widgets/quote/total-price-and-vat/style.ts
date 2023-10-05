import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        // paddingLeft: 33,
        // paddingRight: 33,
        // gap: 30,
        marginTop: 25,
        backgroundColor: "#FFFFFF",
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        width: "48%",
        height: "100%",
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
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        gap:10
      },
      btnStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ED028C",
        borderRadius: 4,
        ...FONT_FAMILY.Lexend(500, 16),
        color: secondColor(500),
        cursor: "pointer",
        width: "100%",
        height: 40,
        backgroundColor:"#FFF",
        minWidth:116,

        
      },
      btnStyle2: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ED028C",
        borderRadius: 4,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        ...FONT_FAMILY.Lexend(500, 13),
        color: secondColor(500),
        cursor: "pointer",
        width: "100%",
        height: 40,
        marginTop: 10,
        backgroundColor:"#FFF",
        minWidth:123
      },
      rightSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 18,
        width: "48%",
      },
      totalBeforeVAT: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 5,
        flexWrap: "wrap" as "wrap",
      },
      totalBefore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "50%",
        minWidth:300
      },
      discountBefore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "50%",
        minWidth:300
        
      },
      priceContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "25%",
      },

      lableStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: "#000000",
        width: "40%",
        minWidth:"fit-content",
      },
      numbersStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: secondColor(400),
        width: "25%",
      },
      totalContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        height: 30,
      },
      totlaPriceContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(700, 24),
      },
      rightSideBtnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 36,
      },
      orderNowBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: secondColor(500),
        borderRadius: 4,
        color: "#FFFFFF",
        ...FONT_FAMILY.Lexend(500, 16),
        width: "50%",
        height: 40,
      },
      sendMessageBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 4,
        color: secondColor(500),
        border: "1px solid #ED028C",
        ...FONT_FAMILY.Lexend(500, 16),
        width: "50%",
        height: 40,
        backgroundColor:"#FFF"
      },
      textInputWithoutStyle: {
        width: "100%",
        height: 20,
        backgroundColor: "transparent",
        ...FONT_FAMILY.Lexend(400, 16),
        color: secondColor(400),
        paddingLeft: 2,
        boxShadow: "none",
      },
      textInputTotalWithoutStyle: {
        height: 20,
        backgroundColor: "transparent",
        ...FONT_FAMILY.Lexend(700, 24),
        color: primaryColor(500),
        textAlign: "right",
        boxShadow: "none",
      },
      lableTotal: {
        color: primaryColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
