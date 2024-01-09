import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "500px",
        borderRadius: 8,
        height: "300px",
        backgroundColor: "#F6F6F6",
      },
      textInputStyle: {
        display: "flex",
        width: "100%",
        height: "40px",
        borderRadius: 4,
      },
      mainInputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 25,
        width: "100%",
        height: "100%",
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
