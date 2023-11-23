import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { primaryColor, neutralColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
          mainContainer: {
            backgroundColor: "#FFFFFF",
            borderRadius: 4,
            width: "1556px",
            height: "116px",
            boxShadow:"0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
          },
          headerStyle: {
            ...FONT_FAMILY.Lexend(700, 16),
            color: neutralColor(900),
            lineHeight: "20px",
          }

    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
