import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, theme } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainBox: {
        width: 400,
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 2,
        mx: "auto",
        mt: "20vh",
      },
      headerBox: {
        display: "flex",
        gap: 1,
        mb: 1,
        justifyContent: "space-between",
        alignItems: "center",
      },
      textFiled: {
        mb: 2,
        "& label.Mui-focused": {
          color: "#2E3092",
        },
      },
      videoFrame: {
        width: "100%",
        height: "400px",
        border: "none",
      },
    };
  }, [theme]);

  return { classes };
};
export { useStyle };
