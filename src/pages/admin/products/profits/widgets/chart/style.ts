import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainCointainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start" as "flex-start",
        width: "100%",
        height: "100%",
        marginTop: 20,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
