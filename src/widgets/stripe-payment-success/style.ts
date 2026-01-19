import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainBox: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: `linear-gradient(135deg, ${primaryColor(500)}, ${secondColor(500)})`,
      },
      cardStyle: {
        padding: "2.5rem",
        maxWidth: "420px",
        textAlign: "center",
        boxShadow: 8,
        borderRadius: "20px",
        backgroundColor: "#d5d6e9",
      },
      title: {
        fontWeight: "bold",
        marginTop: 2,
        color: primaryColor(500),
      },
      subTitle: { marginTop: 1, color: primaryColor(500), fontSize: "1.1rem" },
      boxIcon: {
        display: "flex",
        justifyContent: "center",
        gap: 2,
        marginTop: 3,
      },
      homeBtn: {
        borderColor: primaryColor(100),
        color: primaryColor(100),
        "&:hover": {
          borderColor: primaryColor(500),
          color: primaryColor(500),
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
