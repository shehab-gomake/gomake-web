import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      container: {
        // backgroundColor: "red",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
