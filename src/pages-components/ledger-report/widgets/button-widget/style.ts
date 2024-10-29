import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: 'flex',
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15
      },
      btnContainer: {
        width: "fit-content",
        height: 40,
        lineHeight:"18px"
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };


