import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: "30%",
        borderRadius: 5,
        height: "auto"
      },
      textInputStyle: {
        width: "100%",
        border: "1px solid #2E3092",
        borderRadius: 4,
      },
     
      addBtnStyle: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
         width: "100%",
         marginTop:10
         
      },
      btnStyle: {
        borderRadius: 4,
        backgroundColor: secondColor(500),
        height: 30,
        width: 120
      },
     
      lineStyle: {
        width: "100%",
        backgroundColor: "#EEEEEE",
        border: "1px",
        borderRadius: 2,
        padding:12,
        marginTop: 4,
        ...FONT_FAMILY.Lexend(500, 12),
        display: "flex",
        justifyContent: 'space-between'
      },
      deleteBtn:{
        cursor: "pointer",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
