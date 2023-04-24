import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, neutralColor, errorColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "25%",
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
      },
      content: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      },
      icon: {
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: 10,
      },
      title: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: primaryColor(500),
        marginBottom: 14,
      },
      subTitle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: neutralColor(500),
        textAlign: "center" as "center",
        marginBottom: 33,
        width: "89%",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        width: "100%",
      },
      confermBtn: {
        width: "50%",
        height: 33.29,
        borderRadius: "10px",
        ...FONT_FAMILY.Lexend(500, 9),
        backgroundColor: primaryColor(500),
      },
      cancelBtn: {
        width: "50%",
        height: 33.29,
        borderRadius: "10px",
        ...FONT_FAMILY.Lexend(500, 9),
        backgroundColor: errorColor(500),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
