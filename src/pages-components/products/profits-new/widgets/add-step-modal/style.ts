import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { error } from "console";

const useStyle = () => {
  const { secondColor, errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 500,
        height: 280,
      },
      textInputStyle: {
        height: 40,
        width: "100%",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
      },
      textInputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        width: "100%",
        marginTop: 15,
      },
      labelTextContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
        gap: 8,
      },
      btnContainer: {
        display: "flex",
        justifyContent: "flex-end",
      },
      btnStyle: {
        width: 96,
        height: 40,
        backgroundColor: secondColor(500),
      },
      errorMsgStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: errorColor(500),
        marginBottom: 30,
        marginTop: 10,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
