import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 1150,
        borderRadius: 5,
        height: "auto",
        maxHeight: 900,
        backgroundColor: "#FFFFFF",
        padding: 45,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        width: "100%",
        gap: 16,
        marginTop: 24,
      },
      shapeContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 250,
        height: 333,
        backgroundColor: "white",
        gap: 12,
        cursor: "pointer",
      },
      shapeSelectedContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 250,
        height: 333,
        backgroundColor: "white",
        gap: 12,
        border: `1px solid ${secondColor(500)}`,
        cursor: "pointer",
      },
      shapeNameStyle: {
        ...FONT_FAMILY.Lexend(500, 20),
        color: primaryColor(500),
        paddingLeft: 16,
      },
      shapeWidthHeightStyle: {
        ...FONT_FAMILY.Lexend(400, 16),
        color: primaryColor(900),
        paddingLeft: 16,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 16,
        marginTop: 8,
      },
      customizeBtnStyle: {
        width: "15%",
        height: 40,
      },
      chooseBtnStyle: {
        width: "15%",
        height: 40,
        backgroundColor: secondColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
