import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor, theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        gap: "20px",
        marginBottom: 10,
      },
      titleQuoteContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        paddingTop: "24px",
        paddingLeft: "24px"
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      }, 
       titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 20),
        color:  primaryColor(500),
        lineHeight: "30px",

        width: "70%",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        alignSelf: "center",
        justifyContent: "center",
        gap: "16px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
