import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, errorColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        padding: "10px 0",
      },
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "30%",
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        width: "100%",
        marginTop: 25,
      },
      sendBtn: {
        width: "40%",
        height: 40,
        backgroundColor: secondColor(500),
      },

      btnStyle: {
        width: "40%",
        borderRadius: "8px",
        height: "40px",
      },
      autoComplateRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 30,
      },
      selectTypeContainer: {
        width: "100%",
      },
      errorMsgStyle: {
        padding: 10,
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        marginBottom: 7,
      },
      textInput: {
        width: "100%",
        border: "none",
        height: 45,
        "& .MuiInputBase-root input": {
          borderRadius: "8px !important",
          border: "1px solid rgb(234, 240, 234) !important",
          boxShadow: "none",
          height: 45,
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
