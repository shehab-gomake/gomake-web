import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "35%",
        borderRadius: 5,
        height: "35%",
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 5,
        height: 40,
        boxShadow: "none",
      },
      mainInputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 25,
        width: "100%",
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
      },
      addBtnStyle: {
        width: "50%",
        height: 40,
      },
      errorlabelStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: errorColor(500),
        marginTop: 5,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
