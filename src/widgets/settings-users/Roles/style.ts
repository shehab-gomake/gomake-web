import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      insideStyle: {
        paddingLeft: 0,
        paddingRight: 0,
        width: 500,
        height: 250,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
