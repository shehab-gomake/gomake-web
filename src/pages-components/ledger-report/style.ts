import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        padding:"0px 20px 20px 20px",
        overflowY: "scroll" as "scroll",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
