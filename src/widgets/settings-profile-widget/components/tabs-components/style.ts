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
      connectedBtn: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "green",
        fontWeight: 600,
        marginTop: "8px",
        alignSelf: "end",
        backgroundColor: "#e6ffe6",
        padding: "4px 8px",
        borderRadius: "8px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
