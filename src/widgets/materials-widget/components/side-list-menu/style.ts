import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor , primarySecondaryBlend , theme} = useGomakeTheme();
  const clasess = useMemo(() => {
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
      iconColor: `var(--theme-primary-400, ${primaryColor(300)})`,
      boldIconColor: primaryColor(500),
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: `var(--theme-primary-400, ${primaryColor(300)})`,
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: `var(--theme-primary-400, ${primaryColor(300)})`,
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
