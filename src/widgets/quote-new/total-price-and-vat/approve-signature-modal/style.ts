import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor } = useGomakeTheme();
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
        backgroundColor:"red"
      },
      textInputStyle: {
        borderRadius: 4,
        height: 40,
        width: "100%",
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
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
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
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
