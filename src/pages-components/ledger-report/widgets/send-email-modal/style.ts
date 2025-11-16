import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "50%",
        borderRadius: 5,
        height: "auto",
        maxHeight: 750,
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
      },
      dividerContainer: { width: "100%", marginTop: 10 },
      inputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        width: "100%",
        marginBottom: 25,
      },
      autoComplateStyle: {
        background: "#FFFFFF",
        borderRadius: 4,
        border: "1px solid #FFFFFF",
        height: 40,
        width: "100%",
      },
      itemInputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 5,
        width: "45%",
      },
      textInputStyle: {
        width: "100%",
        minWidth: 340,
      },
      sendBtnContainer: {
        height: 40,
      },
      date2FilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "13%",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
