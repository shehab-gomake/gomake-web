import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
         width: "25%", 
         height: "60%",
        // height: 700,
        padding: 20,
        position: "relative" as "relative",
      },
      addBtnStyle: {
        display : "flex",
        alignSelf: 'flex-end',
        position: "fixed" as "fixed",
        bottom: "10px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
