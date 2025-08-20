import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
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
        color: "rgba(130, 131, 190, 1)",
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
  }, []);
  return {
    classes,
  };
};
export { useStyle };
