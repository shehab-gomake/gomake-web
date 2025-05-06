import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      financialDiv: {
        paddingTop: "30px",
        position: "relative" as "relative",
        height: "78vh",
        overflow: "auto",
        gap: "30px",
        display: "flex",
        flexDirection: "column" as "column",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
