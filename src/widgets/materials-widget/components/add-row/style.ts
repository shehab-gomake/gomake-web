import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: 460,
        height: "fit-content",
        padding: 20,
      },
      inputsDivStyle: {
        display: "flex",
        flexDirection: 'row' as "row",
        gap: "15px",
        flexWrap: "wrap" as "wrap",
        justifyContent: 'space-between',
        padding: "0 5px",
        overflowY: "auto" as "auto",
        maxHeight: "500px",
      },
      addBtnStyle: {
        display: "flex",
        alignSelf: 'flex-end',
        marginTop: "10px",
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
