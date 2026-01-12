import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        paddingLeft: 15,
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 13),
        color: `var(--theme-primary-color,${primaryColor(300)})`,
      },
      actionIconStyle: {
        width: 20,
        height: 20,
        objectFit: "cover" as "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      printBtn: {
        width: "fit-content",
        height: 40,
        borderRadius: 8,
        border: "none",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
