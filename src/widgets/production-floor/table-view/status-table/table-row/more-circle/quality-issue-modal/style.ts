import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useIsMobile } from "@/hooks/use-responsive";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const isMobile = useIsMobile();
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: isMobile ? "90vw" : "-webkit-fill-available",
        minWidth: isMobile ? "unset" : 600,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
        padding: 24,
        zIndex: 9999999999,
      },
      content: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "relative" as "relative",
      },
      closeIcon: {
        display: "flex",
        cursor: "pointer" as "pointer",
        alignSelf: "flex-end",
        width: "fit-content",
        position: "absolute" as "absolute",
        top: 0,
        right: 0,
      },
      icon: {
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: 16,
      },
      title: {
        ...FONT_FAMILY.Lexend(600, 18),
        color: "#101828",
        marginBottom: 20,
        textAlign: "center" as "center",
        width: "85%",
      },
      loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 200,
        width: "100%",
      },
      inputContainer: {
        width: "80%",
        margin: "0 auto",
        position: "relative" as "relative",
        marginBottom: 33,
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 45,
        marginTop: "8px",
      },
      dropdownPaper: {
        position: "absolute" as "absolute",
        top: "100%",
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1300,
        maxHeight: 200,
        overflowY: "auto" as "auto",
        marginTop: 8,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row-reverse" as "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        width: "100%",
        ...(isMobile && { flexWrap: "wrap" as "wrap" }),
      },
      confirmBtn: {
        height: 44,
        lineHeight: "18px",
        borderRadius: "15px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#2E3092",
        border: `1px solid #2E3092`,
        color: "#FFF",
      },
      disabledBtn: {
        backgroundColor: "#D0D5DD",
        border: `1px solid #D0D5DD`,
        cursor: "not-allowed",
      },
      cancelBtn: {
        height: 44,
        borderRadius: "15px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#FFF",
        color: "#344054",
        border: `1px solid #D0D5DD`,
      },
    };
  }, [theme, isMobile]);
  return {
    classes,
  };
};
export { useStyle };
