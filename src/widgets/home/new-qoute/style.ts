import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between" as "space-between",
        minHeight: "100vh",
        // ...FONT_FAMILY.Lexend(600),
      },
      title: {
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(600, 20),
        marginBottom: 16,
      },
      cardsContainer: {
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
      },
      card: {
        width: "50%",
        background: "#FFFFFF",
        boxShadow: "0px 4px 70px rgba(0, 0, 0, 0.08)",
        borderRadius: 8,
        // height: 290,
      },
      autoComplateStyle: {
        border: `1px solid ${secondColor(300)}`,
      },
      autoComplateStyle2: {
        border: `1px solid #F9FBFF`,
        background: "#F9FBFF",
        width: "100%",
      },
    };
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
