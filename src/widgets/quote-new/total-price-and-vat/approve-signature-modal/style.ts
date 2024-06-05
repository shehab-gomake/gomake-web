import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor ,secondColor} = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 710,
        borderRadius: 5,
        height: 530,
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
      nameContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:5,
        width: "100%",
      },
      signatureContainer:{
        width: "100%",
        height: 180,
        border:`1px solid #D0D5DD`,
        borderRadius: 16,
        backgroundColor:"#F4F1F6",
        position: "relative" as "relative",

      },
      textInputStyle: {
        borderRadius: 16,
        height: 40,
        width: "100%",
        border:`1px solid #D0D5DD`,
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
        marginTop:10
      },
      clearBtn:{
     position: "absolute" as "absolute",
     right: 8,
     top: 8,
      },
      saveBtn:{
        height:40,
        width:"100%",
        backgroundColor:secondColor(500),
        borderRadius: 16,
      },
      descriptionContainer:{
        ...FONT_FAMILY.Lexend(400,16),
        width:"90%",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
