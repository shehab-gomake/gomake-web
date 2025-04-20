import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      inputContainer: {
        "& .MuiInputBase-root": {
          display: "flex",
          alignItems: "center",
          height: "40px",
          border: "1px solid #C4C4C4",
          borderRadius: "8px",
        },
        "& label.MuiInputLabel-shrink": {
          top: 0,
          transform: "translateY(-50%)",
          fontSize: "0.75rem",
          backgroundColor: "white",
          padding: "0 4px",
          color: primaryColor(500),
        },
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
