import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ withCircle }) => {
  const { primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      button: {
        border: withCircle ? "1px solid" : "none",
        color: `var(--theme-secondary-color , ${primaryColor(500)})`,

        height: withCircle ? 22 : 25,
        width: withCircle ? 22 : 25,
      },
      menuItem: {
        display: "flex",
        width: 125,
        justifyContent: "space-between",
        alignItems: "center",
        color: primaryColor(300),
      },
      iconStyle: {
        width: withCircle ? 13 : 18,
        height: withCircle ? 60 : 18,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
