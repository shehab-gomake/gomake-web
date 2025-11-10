import { useGomakeTheme } from "@/hooks/use-gomake-thme";
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
      mainModalContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 45,
        marginTop: 20,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 25,
        height: 40,
      },
      sendBtn: {
        width: "30%",
        lineHeight: "17px",
        backgroundColor: secondColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };

