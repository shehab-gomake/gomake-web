import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "35%",
        backgroundColor: "#f7f7f7",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 10,
        marginBottom: 45,
      },
      shapeContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 14,
        paddingRight: 14,
        borderRadius: 4,
        backgroundColor: "#EBECFF",
        width: 109,
        height: 109,
      },
      adjectivesContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "65%",
        gap: 4,
      },
      adjectivesStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(800),
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      },
      addBtnStyle: {
        width: 148,
        height: 40,
        backgroundColor: secondColor(500),
      },
      resetBtnStyle: {
        width: 110,
        height: 40,
        backgroundColor: "white",
        border: `1px solid ${secondColor(500)}`,
        color: secondColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
