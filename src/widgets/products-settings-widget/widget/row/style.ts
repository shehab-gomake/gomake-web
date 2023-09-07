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
        width: "16%",
        textAlign: "center" as "center",
        maxHeight: 50,
        minHeight: 46,
        overflow: "auto",
        paddingTop: 6,
      },
      rowItemExpPofit: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        marginBottom: 8.5,
        marginTop: 8.5,
        color: " #F135A3",
        textAlign: "center" as "center",
        maxHeight: 45,
        overflow: "auto",
        paddingTop: 6,
      },
      editItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(300),
        width: `${width}`,
        marginBottom: 8.5,
        marginTop: 8.5,
        textAlign: "center" as "center",
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
