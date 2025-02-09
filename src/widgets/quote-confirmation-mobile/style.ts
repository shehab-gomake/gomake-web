import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor, grayColor, theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        gap: "20px",
        marginBottom: "60px",
      },
      subMainContainer: {
        display: "flex",
        //width: "70%",
        width: "85%",
        flexDirection: "column" as "column",
        alignItems: "flex-start",
        alignSelf: "center",
        justifyContent: "center",
        gap: "16px",
      },
      titleQuoteContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        paddingTop: "24px",
        paddingLeft: "24px",
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      },
      titleStyle: {
        display: "flex",
        ...FONT_FAMILY.Lexend(500, 20),
        color: primaryColor(500),
        lineHeight: "30px",
        // width: "70%",
        width: "85%",

        flexDirection: "column" as "column",
        alignItems: "flex-start",
        alignSelf: "center",
        justifyContent: "center",
        gap: "16px",
      },
      borderContainer: {
        // width: "70%",
        width: "85%",
        alignSelf: "center",
        borderBottom: `1px solid ${grayColor(200)}`,
        maxHeight: 140,
        overflow: "scroll",
      },
      referenceDate: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
      },

      titleSkeltonContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        padding: "24px 24px 10px 24px",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
