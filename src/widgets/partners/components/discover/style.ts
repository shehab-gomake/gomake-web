import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const { neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        width: "99%",
        height: "116px",
        boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
      // border: "1px dotted #c9c8c3",
      },
      headerStyle: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: neutralColor(900),
        lineHeight: "20px",
      },
      searchInputStyle: {
        height: 40,
        width: "30%",
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
