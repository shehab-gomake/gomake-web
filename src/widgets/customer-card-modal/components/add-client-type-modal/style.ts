import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor, theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "fit-content",
        borderRadius: 8,
        gap: "8px",
        height: "auto",
        maxHeight: 400,
        backgroundColor: "#f7f7f7",
      },
      addBtnStyle: {
        width: "50%",
        height: 40,
      },
      mainInputsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 25,
        width: "100%",
        height: "100%",
      },
      btnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
      },
      containerButtons: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        height: "100%",
      },
      optionStyle: {
        margin: `0 0 ${5}px 0`,
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 15,
        flexWrap: "wrap" as "wrap",
        marginBottom: 25,
        top: 0,
        left: 0,
        position: "relative" as "relative",
      },
       textInputStyle: {
        display: "flex",
        width: "100%",
        height: "40px",
        borderRadius: 4,
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
        maxWidth: "40%",
        width: "max-content",
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
      addClientTypeBtnContainer:{
        marginTop: "10px",
        display: "flex",
        justifyContent: "center" as "center",
        width: "100%",
      },
      addClientTypeBtn:{
        width: "50%", height: 40
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
