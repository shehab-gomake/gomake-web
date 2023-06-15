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
      detailsLine: {
        width: 15,
        height: 33,
        background: primaryColor(500),
        borderRadius: 24,
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
      textInputWithoutStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(900),
        textAlign: "center",
        marginBottom: 14,
        marginTop: 14,
        width: "100%",
        height: 20,
        backgroundColor: "transparent",
        // ...FONT_FAMILY.Lexend(400, 16),
        // color: secondColor(400),
        paddingLeft: 2,
        boxShadow: "none",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
