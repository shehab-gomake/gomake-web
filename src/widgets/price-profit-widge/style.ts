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
        backgroundColor: "#FFFF",
        height: "100%",
        borderRadius: 16,
      },
      divider: {
        width: "100%",
        borderColor: "#E0E0E0",
      },
      modalStyle: {
        width: "40%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
        zIndex: 999999,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
