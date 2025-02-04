import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainHeaderContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 7,
      },
      firstHeaderContainer: {
        display: "flex",
        width: "100%",
        // height: "170px",
        backgroundColor: "#FFF",
        borderRadius: 17,
        padding: "15px 20px",
      },
      secondHeaderContainer: {
        display: "flex",
        width: "100%",
        maxWidth: "100%",
        flexWrap: "wrap" as "wrap",
        // height: "128px",
        backgroundColor: "#FFF",
        borderRadius: 17,
        padding: "15px 20px",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
