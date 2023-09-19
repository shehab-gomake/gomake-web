import { useGomakeTheme } from "@/hooks/use-gomake-thme";

import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
