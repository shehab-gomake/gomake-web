import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "35%",
        height: "40%",
      },
      selectedSupplierContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
      noDataStyle: {
        marginTop: 20,
        ...FONT_FAMILY.Lexend(600, 22),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
