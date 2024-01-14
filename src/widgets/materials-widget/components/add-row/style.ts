import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "25%",
        height: "60%",
        padding: 20,
      },
      inputsDivStyle: {
        display: "flex",
        flexDirection: 'row' as "row",
        gap: "25px",
        flexWrap: "wrap" as "wrap",
        justifyContent: 'space-between',
        padding: "0 5px"
      },
      addBtnStyle: {
        display: "flex",
        alignSelf: 'flex-end',
        position: "fixed" as "fixed",
        bottom: "10px",
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
