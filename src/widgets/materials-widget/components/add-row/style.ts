import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        padding: "5px",
      },
      inputsDivStyle: {
        display: "flex",
        flexDirection: 'row' as "row",
        gap: "5px",
        flexWrap: "wrap" as "wrap",
        justifyContent: 'space-between',
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
