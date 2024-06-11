import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "35%",
        borderRadius: 5,
        height: "35%",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap:24,
        marginTop:18
      },
      signerNameContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:24,
      },
      labelStyle:{
        ...FONT_FAMILY.Lexend(700,22)
      },
      signerNameStyle:{
        ...FONT_FAMILY.Lexend(400,20)
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
