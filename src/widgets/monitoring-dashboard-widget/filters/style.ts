import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor, errorColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
      },
      datesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap" as "wrap",
      },
      button: {
        width: "fit-content",
        minWidth: "134px",
        height: "44px",
        borderRadius: "10px",
        color: primaryColor(500),
        borderColor: primaryColor(500),
      },
      lateButton: {
        width: "134px",
        height: "40px",
        borderRadius: "10px",
        color: errorColor(500),
        borderColor: errorColor(500),
      },
      activeButton: {
        width: "134px",
        height: "44px",
        borderColor: primaryColor(500),
        borderRadius: "10px",
      },
      machinesWrapper: {
        alignSelf: "flex-end",
        marginRight: "auto" as "auto",
      },
      buttonLabel: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "rgba(52, 64, 84, 1)",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
