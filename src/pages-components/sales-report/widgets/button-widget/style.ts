import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
const {secondColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:15
      },
      btnContainer:{
        width:"fit-content",
        height:40,
        backgroundColor:secondColor(500)
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };


