import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        gap:"20px"
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
