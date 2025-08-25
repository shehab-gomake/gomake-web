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
      headerSection: {
        width: "100%",
        flexShrink: 0,
      },
      contentSection: {
        width: "100%",
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
        padding: "16px 0",
      },
      chartContainer: {
        width: "100%",
        marginBottom: "20px",
      },
      modalStyle: {
        width: "50%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
