import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor , theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        gap:"20px"
      },
      titleQuoteContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
     //   padding:"10px"
     paddingTop: "24px",
     paddingLeft: "24px"
   
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
