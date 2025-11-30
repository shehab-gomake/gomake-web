import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        position: "relative" as "relative",
      },
      textInputStyle: {
        width: "100%",
        border: "none",
        height: 45,
      },
      dropdownPaper: {
        position: "absolute" as "absolute",
        top: "100%",
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1300,
        maxHeight: 200,
        overflowY: "auto" as "auto",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
