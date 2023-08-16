import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor, primaryColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "50%",
        borderRadius: 5,
        height: "45%",
        backgroundColor: "#f7f7f7",
      },
      addNewValueContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 15,
        flexWrap: "wrap" as "wrap",
        marginBottom: 25,
      },
      textInputContainer: {
        width: "25%",
      },
      parameterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        width: "fit-content",
        minWidth: 180,
      },
      parameterLabelStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: "#090A1D",
      },
      spanRequierd: {
        color: errorColor(500),
      },
      renderParameterTypeContainer: {
        display: "flex",
        width: "95%",
        backgroundColor: "#FFF",
        borderRadius: 4,
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        // backgroundColor: "#FFF",
        border: `1px solid ${primaryColor(400)}`,
        // boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
