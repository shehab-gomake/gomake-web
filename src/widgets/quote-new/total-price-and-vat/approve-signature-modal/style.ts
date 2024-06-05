import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor ,secondColor} = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 400,
        borderRadius: 5,
        height: "65%",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:10,
        width: "100%",
        marginTop: 15
      },
      signatureContainer:{
        width: "100%",
        height: 200,
        border:"1px solid gray",
        borderRadius: 4,

      },
      textInputStyle: {
        borderRadius: 4,
        height: 40,
        width: "100%",
        border:"1px solid gray",
        boxShadow: "none",        
      },
      deleverdDate: {
        display: "flex",
        alignItems: "center",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(400, 16),
        color: grayColor(500),
        cursor: "pointer",
        marginTop:5,
        marginBottom:5,
        backgroundColor:"white",
        border:"1px solid gray",
        borderRadius: 4,
        height:40,
        width:"100%",
        paddingLeft:18
      },
      datePickerContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      btnsContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width:"100%",
        marginTop:25
      },
      clearBtn:{
        height:40,
        width:"48%",
        backgroundColor:secondColor(500)
      },
      saveBtn:{
        height:40,
        width:"48%",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
