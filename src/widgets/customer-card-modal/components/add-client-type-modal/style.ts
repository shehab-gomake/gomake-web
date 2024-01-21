import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { errorColor , primaryColor , theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "500px",
        borderRadius: 8,
        height: "300px",
        backgroundColor: "#F6F6F6",
      },
      textInputStyle: {
        display: "flex",
        width: "100%",
        height: "40px",
        borderRadius: 4,
      },

            addBtnStyle: {
        width: "50%",
        height: 40,
      },
      errorlabelStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: errorColor(500),
        marginTop: 5,
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
      containerButtons:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        height: "100%",
      },

      optionStyle:{
        padding: 5 * 2,
        margin: `0 0 ${5}px 0`,
        userSelect: "none",
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




      // insideStyle: {
      //   width: "50%",
      //   borderRadius: 5,
      //   height: "auto",
      //   maxHeight: 500,
      //   backgroundColor: "#f7f7f7",
      // },
      // addBtnStyle: {
      //   display: "flex",
      //   flexDirection: "row" as "row",
      //   alignItems: "center",
      //   justifyContent: "flex-start",
      //   gap: 10,
      //   marginBottom: 15,
      // },

      // textInputStyle: {
      //   width: "100%",
      //   borderRadius: 4,
      //   height: 40,
      //   // backgroundColor: "#FFF",
      //   border: `1px solid ${primaryColor(400)}`,
      //   // boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      // },
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


    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
