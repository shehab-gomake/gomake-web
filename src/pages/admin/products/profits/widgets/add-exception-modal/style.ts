import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "30%", borderRadius: 5, height: "80%" },
      selectTypeStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(700, 14),
        marginBottom: 8,
      },
      btnContainer: {
        marginTop: 20,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
