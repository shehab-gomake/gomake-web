import { useGomakeTheme } from "@/hooks/use-gomake-thmem";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      rightContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#504FA1",
        flex: 0.5,
        height: "100vh",
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
  }, [theme]);
  return {
    clasess,
  };
};
export { useStyle };
