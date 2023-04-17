import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "95%" },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
