import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme()
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "500px",
        height: "250px",
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        alignItems: "flex-end",
      },
    };
  }, [theme]);

  return {
    classes,
  };
};

export { useStyle };