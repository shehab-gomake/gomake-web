import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      modalContent: {
        maxWidth: "550px",
        width: "100%",
        padding: "40px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #ffffff 0%, #fef5fa 100%)",
        boxShadow: "0 10px 40px rgba(237, 2, 140, 0.15)",
      },
      modalTitleContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "8px",
        marginBottom: "24px",
      },
      modalTitle: {
        ...FONT_FAMILY.Lexend(700, 28),
        color: "#ED028C",
        background: "linear-gradient(135deg, #ED028C 0%, #9333ea 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      },
      modalTitle2: {
        ...FONT_FAMILY.Lexend(700, 28),
        color: "#000",
      },
      modalSubtitle: {
        ...FONT_FAMILY.Heebo(400, 15),
        color: "#666",
        marginTop: "4px",
      },
      formContainer: {
        width: "100%",
        paddingTop: "8px",
      },
      label: {
        ...FONT_FAMILY.Lexend(600, 14),
        color: "#2D2D2D",
        marginBottom: "8px",
        display: "block",
      },
      required: {
        color: "#ED028C",
        marginLeft: "4px",
      },
      input: {
        height: 48,
        borderRadius: "8px",
        border: "2px solid transparent",
        background: "#FFF",
        // boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s ease",
      },
      errorText: {
        ...FONT_FAMILY.Heebo(400, 12),
        color: "#d32f2f",
        marginTop: "6px",
        marginLeft: "4px",
      },
      buttonContainer: {
        marginTop: "16px",
        width: "100%",
      },
      button: {
        width: "100%",
        height: 52,
        borderRadius: "8px",
      },
      verificationIconContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "12px",
      },
      verificationIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        //   background: "linear-gradient(135deg, #9333ea 0%, #c084fc 100%)",
        background:
          "linear-gradient(135deg, rgb(237, 2, 140) 0%, rgb(147, 51, 234) 100%)",
        display: "flex",
        alignItems: "center" as "center",
        justifyContent: "center",
      },
    };
  }, [primaryColor, secondColor]);

  return { classes };
};

export { useStyle };
