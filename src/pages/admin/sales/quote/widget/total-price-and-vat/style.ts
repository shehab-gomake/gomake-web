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
        paddingLeft: 33,
        paddingRight: 33,
        gap: 65,
        marginTop: 25,
        // position: "fixed" as "fixed",
        // bottom: 0,
      },
      leftSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 16,
        width: "47%",
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
        width: "25%",
      },
      rightSideContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 18,
        width: "53%",
      },
      totalBeforeVAT: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      totalBefore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "45%",
      },
      discountBefore: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "50%",
      },
      priceContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "30%",
        // gap: 30,
      },

      lableStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: "#000000",
        width: 155,
      },
      numbersStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: secondColor(400),
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
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
