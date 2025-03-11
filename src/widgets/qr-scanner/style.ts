import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#2e3092",
        color: "white",
        "&:hover": { backgroundColor: "#115293" },
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
      backToHome: {
        borderRadius: "5px",
        padding: "10px",
        fontWeight: "bold",
        textTransform: "none",
        backgroundColor: "#2e3092",
        "&:hover": {
          backgroundColor: "#1d1f75",
        },
      },
      cardContainer: {
        width: "100%",
        maxWidth: 400,
        borderRadius: "15px",
        boxShadow: 3,
      },
    };
  }, [t]);
  return {
    classes,
  };
};
export { useStyle };
