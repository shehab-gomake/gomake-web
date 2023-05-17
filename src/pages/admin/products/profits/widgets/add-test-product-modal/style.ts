import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "35%",
        borderRadius: 5,
        height: "35%",
      },
      selectTypeStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(700, 14),
        marginBottom: 8,
      },
      mainCointainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between" as "space-between",
        width: "100%",
        height: "100%",
      },

      insideCointaner: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between" as "space-between",
        width: "100%",
        height: "100%",
      },
      addBtnStyle: {
        display: "flex",
        justifyContent: "center" as "center",
        width: 240,
      },
      btnStyle: {
        display: "flex",
        borderRadius: 4,
        height: 40,
      },
      btnCointainer: {
        display: "flex",
        width: "100%",
        justifyContent: "center" as "center",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
