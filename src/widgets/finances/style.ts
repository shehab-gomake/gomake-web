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
        gap: 10,
        padding: "0px 15px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
