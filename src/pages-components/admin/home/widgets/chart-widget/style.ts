import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = (dir) => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        backgroundColor: "#FFFFFF",
        margin: "0 4px",
        borderRadius: 8,
        width: "96.5%",
        height: "100%",
        boxShadow:
          "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
        display: "flex",
        justifyContent: dir == "rtl" ? "flex-end" : "flex-start",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
