import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const pdfStyle = useMemo(() => {
    return {
      container: {
        width: "100%",
        // padding: "10px",
        // backgroundColor: "red",
        // marginBottom: "10px",
        // height: "80vh",
      },
    };
  }, [theme]);
  const classes = useMemo(() => {
    return {
      container: {
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      },

      insideStyle: {
        width: "60%",
        borderRadius: 8,
        gap: "8px",
        height: "80%",
        maxHeight: "80vh",
        backgroundColor: "#F7F7F7",
      },
    };
  }, [theme]);
  return {
    classes,
    pdfStyle,
  };
};
export { useStyle };
