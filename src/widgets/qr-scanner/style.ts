import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor , theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        position: "fixed",
        bottom: 20,
        right: 20,
        background: `linear-gradient(135deg, ${primaryColor(500)} 30%, ${secondColor(500)} 90%)`,
        color: "white",
        "&:hover": { backgroundColor: "#115293" },
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
      backToHome: {
        borderRadius: "5px",
        padding: "10px",
        fontWeight: "bold",
        textTransform: "none",
        backgroundColor: primaryColor(500),
        "&:hover": {
          backgroundColor: primaryColor(600),
        },
      },
      cardContainer: {
        width: "100%",
        maxWidth: 400,
        borderRadius: "15px",
        boxShadow: 3,
      },
    };
  }, [t , theme]);
  return {
    classes,
  };
};
export { useStyle };
