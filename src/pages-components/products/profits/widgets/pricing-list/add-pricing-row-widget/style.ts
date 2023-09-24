import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 5,
      },
      textInputStyle: {
        height: 42,
        width: 159,
      },
      saveBotton: {
        color: "#a1a2cd",
        display: "flex",
        justifyContent: "flex-start",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
