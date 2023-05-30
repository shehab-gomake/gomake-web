import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        flexDirection: "row" as "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
      },
      rowItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        textAlign: "center",
        marginBottom: 14,
        marginTop: 14,
      },

      controlsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
      },
      textInputsContainer: {
        marginRight: 20,
      },
      textInputStyle: {
        height: 42,
        width: 80,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
