import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "25%",
      },
      noteTextStyle:{
        ...FONT_FAMILY.Lexend(700,16),
        marginTop: 25
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
