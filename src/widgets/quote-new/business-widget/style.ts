import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      businessContainerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 24,
        marginBottom: 14,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
