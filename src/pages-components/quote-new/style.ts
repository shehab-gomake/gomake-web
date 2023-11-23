import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, grayColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        maxWidth: "100%",
        position: "relative" as "relative",
        paddingRight: 20,
        height: "100%",
        overflow: "hidden",
        marginBottom: 145,
      },
      titleQuateContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 5,
        marginBottom: 14,
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        lineHeight: "30px",
      },
      deleverdDate: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
      },
      datePickerContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 17,
        paddingBottom: 14,
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 14,
      },
      lineDateStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 1,
        height: 19,
        color: grayColor(200),
        backgroundColor: grayColor(200),
      },
      bordersecondContainer: {
        width: "100%",
        borderBottom: `1px solid ${grayColor(200)}`,
        marginBottom: 12,
        marginTop: 12,
        maxHeight: 160,
        overflow: "scroll",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
