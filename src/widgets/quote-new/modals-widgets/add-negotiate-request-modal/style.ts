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
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
        height: 110,
        overflow: "scroll",
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 25,
      },
      sendBtn: {
        width: "30%",
        backgroundColor: secondColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
