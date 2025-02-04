import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ row }: any) => {
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center" as "center",
        height: 60,
        position: "relative" as "relative",
        cursor: "pointer",
        gap: 5,
        textAlign: "center" as "center",
      },
      rowItem: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        textalign: "center",
      },
      rowItemExpPofit: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        textalign: "center",
        width: "25%",
      },
      scopeRowItem: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...FONT_FAMILY.Lexend(400, 14),
        lineHeight: "18px",
        color: primaryColor(900),
        textalign: "center",
      },
      autoComplateStyle: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",

        border: "1px solid red",
        backgroundColor: "#FFFFFF",
        color: secondColor(400),
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
      },
      deleteContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        right: -50,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
