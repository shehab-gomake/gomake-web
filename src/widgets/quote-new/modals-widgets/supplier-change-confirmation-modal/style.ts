import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, grayColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      descriptionText: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: grayColor(500),
        marginBottom: "16px",
        textAlign: "center" as "center",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};

export { useStyle };

