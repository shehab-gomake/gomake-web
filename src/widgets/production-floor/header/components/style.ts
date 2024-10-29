import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      saveSelectionModalStyle: {
        // width: "25%",
        width: "544px",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        zIndex: 999999,
        padding: "20px",
      },
      colorDiv: {
        width: "50%",
        borderRadius: "8px",
        height: "44px",
        background: "white",
        color: "#000000",
        border: "1px solid  #D0D5DD",
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-around",
        cursor: "pointer",
        alignItems: "center",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
