import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      multiSelectStyle: {
        display: "flex",
        width: "200px",
        border: "0px"
      },
      multiSelectOption: {
        width: "100%",
        ...FONT_FAMILY.Lexend(400, 14),
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: 'center'
      },
      firstLevelLabel: {
        color: "var(--colors-text-text-primary-900, #101828)",
        textAlign: "right" as "right",
        lineHeight: "24px",
        padding: "0px 10px",
        ...FONT_FAMILY.Inter(700, 16),
      },
      otherLevelsLabel: {
        color: "var(--colors-text-text-primary-900, #101828)",
        lineHeight: "24px",
        ...FONT_FAMILY.Inter(500, 16),
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };