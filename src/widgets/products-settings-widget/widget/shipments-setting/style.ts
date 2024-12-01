import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      btnStyle: {
        width: "100%",
        borderRadius: "8px",
        height: "40px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
