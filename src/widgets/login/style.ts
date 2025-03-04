import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between" as "space-between",
        width: "100%",
      },
      mobileContainer: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "space-between" as "space-between",
        width: "100%",
        height: "100vh",
      },
      insideStyle: {
        width: "620px",
        borderRadius: 8,
        gap: "8px",
        height: "300px",
        maxHeight: 400,
        backgroundColor: "#F7F7F7",
      },

      poweredContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50,
      },
      poweredByLbl: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(500),
      },
      goMakeByLbl: {
        ...FONT_FAMILY.Lexend(400, 28),
        color: primaryColor(500),
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
