import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "430px",
        height: "400px",
        padding: 20,
      },
      addBtnStyle: {
        display: "flex",
        alignSelf: 'flex-end',
        position: "fixed" as "fixed",
        bottom: "10px",
      },
      categoryModalStyle: {
        paddingLeft: 20,
        padding: 20,
        width: "518px",
        height: "214px"
      },
      addButtonStyle: {
        height: 40,
        width: "200px",
        paddingTop: "10px"
      },
      accordionRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between"
      },
      firstStack: {
        display: "flex",
        flexDirection: "column" as "column",
        marginTop: "10px"
      },
      secondStack: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: "25px",
        flexWrap: "wrap" as "wrap"
      },
      firstStackStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "40px"
      },
      secondStackStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end"
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
