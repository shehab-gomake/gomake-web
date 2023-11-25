import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: { width: "85%" },

      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        padding: 15,
        paddingRight: 50,
        width: "205px",
        height: "34px",
      },
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: primaryColor(300),
      },
      menuBlockTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: errorColor(300),
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
        border: "1px"
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
