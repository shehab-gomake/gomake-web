import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "35%",
      },
      inputsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width:"100%",
        gap:25,
        marginTop:15
       },
      dropDownListStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        border: "0px",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
       
      },
      addNewBtnContainer:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width:"100%",
      },
      addBtnStyle: {
        height: 40,
        backgroundColor:secondColor(500),
        width: "60%",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
