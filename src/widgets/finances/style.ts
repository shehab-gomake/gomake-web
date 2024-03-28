import { useMemo } from "react";
const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: 'column' as "column",
        justifyContent: 'flex-start',
        alignItems: "flex-start",
        width: "100%",
        gap:10
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
