import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "fit-content",
      },
      noteTextStyle:{
        ...FONT_FAMILY.Lexend(700,16),
        marginTop: 25
      },
      btnThirdContainer: {
        border: `1px solid ${primaryColor(500)}`,
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: primaryColor(500),
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: 40,
        width: "fit-content",
        padding: "10px",
        borderRadius: 8,
        marginTop:55
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
