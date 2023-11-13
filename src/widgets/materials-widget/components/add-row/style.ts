import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: 400, 
        height: 600,
        padding: 20,
        //position: "relative" as "relative",
      },
      addBtnStyle: {
        display : "flex",
        alignSelf: 'flex-end'
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
