import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor, primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: 700,
        borderRadius: 8,
        height: "fit-content",
        justifyContent: "center",
        alignItems: "center",
      },
      insideStyleNew: {
        width: "37%",
        minWidth: "500px",
        maxWidth: 860,
        borderRadius: 10,
        height: "fit-content",
      },
      headerStyle: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 25,
        marginTop: 15,
      },
      iconContainer: {
        width: 120,
        height: 120,
        color: secondColor(500),
      },
      titleContainer: {
        display: "flex",
        ...FONT_FAMILY.Inter(600, 20),
        textAlign: "center" as "center",
        color: "var(--colors-text-text-primary-900, #101828)",
        lineHeight: "28px",
      },
      subTitleContainer: {
        display: "flex",
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#475467",
        textAlign: "center" as "center",
        padding: "0px 30px",
      },
      mainBtnContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        width: "100%",
      },
      cancelContainer: {
        display: "flex",
        height: 40,
        width: "28%",
      },
      withNotificationContainer: {
        display: "flex",
        lineHeight: "20px",
        height: 40,
        width: "42%",
      },
      withoutNotificationContainer: {
        display: "flex",
        lineHeight: "20px",
        height: 40,
        width: "40%",
      },
      btnStyle: {
        borderRadius: "8px",
        height: "40px",
        lineHeight: "18px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      secondBtn: {
        borderRadius: "8px",
        height: "40px",
        color: primaryColor(500),
        border: `1px solid ${primaryColor(500)}`,
        background: "white",
        lineHeight: "18px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
