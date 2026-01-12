import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        padding: 10,
        width: 500,
        height: "fit-content",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
