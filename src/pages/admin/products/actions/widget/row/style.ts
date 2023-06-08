import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width, index, tablePercent }: any) => {
  const { primaryColor } = useGomakeTheme();
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
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
        marginBottom: 18.5,
        marginTop: 18.5,
        width: "150px",
      },
      rowItemExpPofit: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        // color: primaryColor(900),
        textalign: "center",
        marginBottom: 18.5,
        marginTop: 18.5,
        color: " #F135A3",
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
        marginBottom: 18.5,
        marginTop: 18.5,
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
