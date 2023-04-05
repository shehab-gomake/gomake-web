import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "100%" },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
