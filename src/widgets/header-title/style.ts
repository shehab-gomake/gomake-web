import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      container: {
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(700, 18),
        paddingBottom: 15,
        borderBottom:"1px solid #dc348b"
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
