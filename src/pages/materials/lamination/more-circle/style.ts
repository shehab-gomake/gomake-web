import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "85%" },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
