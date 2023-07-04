import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "80%",
        borderRadius: 5,
        height: "90%",
        backgroundColor: "#f7f7f7",
      },
      selectTypeStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 14),
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
