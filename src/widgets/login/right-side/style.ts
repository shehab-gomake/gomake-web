import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTheme } from "@/contexts/theme";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const { currentTheme } = useTheme();
  const isHpClient = currentTheme === "hp-client";
  const classes = useMemo(() => {
    return {
      rightContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isHpClient ? "#0642be" : primaryColor(400),
        height: "100%",
        minHeight: "100vh",
        width: "50%",
      },
      poweredContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 53,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#FFF",
      },
      gomakeByLbl: {
        ...FONT_FAMILY.Lexend(400, 28),
        color: "#FFF",
      },
      welcomeLbl: {
        ...FONT_FAMILY.Outfit(600, 56),
        color: "#FFF",
        width: "50%",
        textAlign: "center" as "center",
        lineHeight: "71px",
      },
      descriptionLbl: {
        ...FONT_FAMILY.Outfit(400, 16),
        color: "#FFF",
        width: "75%",
        textAlign: "center" as "center",
        marginTop: 20,
        marginBottom: 53,
        lineHeight: "20px",
      },
    };
  }, [theme, isHpClient]);
  return {
    classes,
  };
};
export { useStyle };
