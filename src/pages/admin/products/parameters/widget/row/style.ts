import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width, index, tablePercent }: any) => {
  const { primaryColor, neutralColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      },
      rowItem: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        marginBottom: 8.5,
        marginTop: 8.5,
        width: "150px",
        gap: 5,
        maxHeight: 45,
        overflow: "auto",
        paddingTop: 5,
      },
      rowItemScroll: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        marginBottom: 8.5,
        marginTop: 8.5,
        width: "150px",
        gap: 5,
        maxHeight: 30,
        overflow: "auto",
      },
      editItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(300),
        textalign: "center",
        width: `${width}`,
        marginBottom: 8.5,
        marginTop: 8.5,
      },
      controlsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
      },
      textInputsContainer: {
        marginRight: 20,
      },
      textInputStyle: {
        height: 42,
        width: 80,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
