import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useMemo } from "react";

const useStyle = () => {
  const clasess = useMemo(() => {
    return {
      filterContainer:{
        display:"flex",
        flexDirection:"row" as "row",
        justifyContainer:"flex-start",
        alignItems:"center",
        width:"100%",
        gap:convertWidthToVW(50),
        marginTop:convertHeightToVH(50)
      },
      autoComplateStyle:{
        width:convertWidthToVW(200)
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
