import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      multiSelectStyle2: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderRadius: 4,
        display: "flex",
        border: "0px",
        flexDirection: "row" as "row",
        alignitems: "flex-start",
        justifyContent: "flex-start",
        height: 40,
        overflow: "scroll",
      },
      menuItem: {
        display: "flex",
        width: 125,
        justifyContent: "space-between",
        alignItems: "center",
        color: primaryColor(300),
      },
      menuBtn: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: primaryColor(300),
        height: "10px",
      },
      multiSelectStyle: {
        display: "flex",
        // justifyContent:"center",
        width: "80%",
      },
      multiSelectOption: {
        width: "100%",
        ...FONT_FAMILY.Lexend(400, 14),
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
