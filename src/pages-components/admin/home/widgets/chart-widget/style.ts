import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
        mainContainer: {
            backgroundColor: "#FFFFFF",
            margin: '0 4px',
            borderRadius: 8,
            width: "100%",

            boxShadow:"0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
          },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
