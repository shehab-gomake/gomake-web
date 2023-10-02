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
        ...FONT_FAMILY.Lexend(500, 14),
      },
      changePassBtnStyle: {
        width: "180px",
        height: "40px"
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
