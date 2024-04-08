import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme , primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: { width: "85%" },
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        paddingLeft: 15,
      },
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: primaryColor(300),
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
        border: "1px"
      },
      iconStyle: {
        width: "18px",
        height: "18px",
        color: "#8283BE"
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
