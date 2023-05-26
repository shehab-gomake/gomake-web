import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        height: "25%",
      },
      textInputStyle: {
        height: 48,
        width: "50%",
      },
      mainContainer: {
        position: "relative" as "relative",
        height: "100%",
      },
      btnContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        bottom: 0,
        right: 0,
      },
      btnStyle: {
        width: 96,
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
