import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      leftContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        padding: "40px",
        backgroundColor: "#FFFFFF",
      },
      loginContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
        marginTop: "40px",
      },
      loginLbl: {
        ...FONT_FAMILY.Lexend(600, 28),
        color: primaryColor(900),
        marginBottom: "10px",
      },
      descriptionLbl: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(600),
        marginBottom: "30px",
        textAlign: "center" as "center",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        width: "100%",
        marginBottom: "20px",
      },
      inputLbl: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
        marginBottom: "8px",
      },
      input: {
        width: "100%",
      },
      btnContainer: {
        width: "100%",
        marginTop: "10px",
      },
      errorMsgStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#FF0000",
        marginTop: "10px",
        minHeight: "20px",
        textAlign: "center" as "center",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
