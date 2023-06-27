import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "35%",
        height: "40%",
      },
      selectedSupplierContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
