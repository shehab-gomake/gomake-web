import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "518px",
        borderRadius: 16,
        height: "247px",
        padding: "1.703vw 1.3624vw 1.3624vw",
        paddingTop:"10px !important",
       
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
      
 
  
      },
      mainInputsContainer: {
        width:"60%",
        marginTop:"3%",
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 25,
       
      },
      btnContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        width: "100%",
      },
      addBtnStyle: {
        width: "15%",
        backgroundColor:"#F135A3",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
