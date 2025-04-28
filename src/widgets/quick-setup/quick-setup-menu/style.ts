import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainerOld: {
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 300,
        borderRadius: 3,
        boxShadow: 8,
        p: 2,
        zIndex: 1300,
      },
      mainContainer: {
        position: "fixed",
        bottom: 24,
        right: 24,
        // width: 320,
        width: 280,
        borderRadius: "16px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        p: 2,
        backgroundColor: "#ffffff",
        zIndex: 1300,
      },
      linearProgress: {
        height: 6,
        borderRadius: 3,
        "& .MuiLinearProgress-bar": {
          backgroundColor: primaryColor(500),
        },
      },
      checkBox: {
        color: primaryColor(500),
        "&.Mui-checked": {
          color: primaryColor(400),
        },
      },
      btnStyle: {
        backgroundColor: primaryColor(500),
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: primaryColor(200),
        },
      },
    };
  }, []);

  return classes;
};
export { useStyle };
