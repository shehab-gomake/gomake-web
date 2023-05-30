import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = ({ headerWidth, index }: any) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      tableHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: 16,
      },
      headerStyle: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: primaryColor(600),
      },
      filtersContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 15,
        width: "30%",
      },
      autoComplateStyle: {
        background: "transparent",
        color: "#F135A3",
        ...FONT_FAMILY.Lexend(500, 16),
        borderRadius: 4,
        border: "1px solid transparent",
        height: 40,
        width: "100%",
        "&MuiInputBase-input": {
          color: "red",
        },
      },
      tableHeadersStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: 22,
        paddingRight: 22,
        marginBottom: 14,
      },
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#B5B7C0",
        width: headerWidth[index],
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
