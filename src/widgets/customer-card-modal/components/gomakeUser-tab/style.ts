import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      buttonsStyle: {
        color: "var(--error-500, #D92C2C)",
        fontStyle: 'normal',
        lineHeight: 'normal',
        border: "none",
        background: "#FFF",
        marginLeft: "7px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
