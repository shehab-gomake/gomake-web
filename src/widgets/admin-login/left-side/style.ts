import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      leftContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center" as "center",
        alignItems: "center",
        flex: 0.5,
        height: "100vh",
      },
      logoContainer: {
        marginTop: 100,
        marginBottom: 100,
        display: "flex",
      },
      loginContainer: {
        alignItems: "flex-start",
        width: "100%",
        paddingLeft: 48,
      },
      loginLbl: {
        color: primaryColor(600),
        ...FONT_FAMILY.Outfit(600, 48),
        marginBottom: 40,
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        marginTop: 40,
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 20),
      },
      input: {
        width: "87%",
      },
      btnContainer: {
        width: "53%",
        marginTop: 62,
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
