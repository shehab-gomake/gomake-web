import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const { errorColor, primaryColor, theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        height: "100%",
      },
      insideStyle: {
        width: "30%",
        borderRadius: "16px",
        gap: "8px",
        height: "auto",
        maxHeight: 400,
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
        gap: "10px",
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
      addClientTypeBtnContainer: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "center" as "center",
        width: "100%",
      },
      addClientTypeBtn: {
        width: "50%",
        height: 40,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        alignItems: "flex-end",
      },
      divWithPer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 5,
      },
      modalTitle: {
        ...FONT_FAMILY.Inter(500, 20),
        color: "#000000",
        paddingBottom: "10px",
      },
      cancelBtnStyle: {
        width: "50%",
        borderRadius: "8px",
        height: "44px",
        backgroundColor: "white",
        color: "#000000",
        border: "1px solid #D0D5DD",
        "&:hover": {
          backgroundColor: "#f5f5f5",
          border: "1px solid #D0D5DD",
          borderRadius: "8px",
          boxShadow: "none",
        },
      },
      btnStyle: {
        width: "50%",
        borderRadius: "8px",
        height: "44px",
      },
    };
  }, [i18next.language, t, theme]);
  return {
    classes,
  };
};
export { useStyle };
