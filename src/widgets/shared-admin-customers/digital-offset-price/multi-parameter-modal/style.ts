import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {primaryColor,secondColor}=useGomakeTheme()
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 444,
        borderRadius: 12,
        height: 747,
        backgroundColor: "#f7f7f7",
        padding:20
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width:"100%",
        height:"100%",
      },
      titleStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        color:primaryColor(900),
        width:"100%",
        marginBottom:6
      },
      multiSelectContainer:{
        border: "1px solid rgba(208, 213, 221, 1)",
        width: "100%",
        height: 44,
      },
      multiSelectMainContainer:{ width: "100%", height: 44, marginBottom: 16 },
      tableContainer:{
        border: "1px solid rgba(208, 213, 221, 1)",
        borderRadius:8,
        width:"100%",
        height:565
      },
      headerTableContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 44,
        background: "rgba(244, 241, 246, 1)",
        paddingLeft: 24,
        borderTopRightRadius:8,
        borderTopLeftRadius:8,
        borderBottom:"1px solid rgba(208, 213, 221, 1)",
      },
      headerTableStyle:{
        ...FONT_FAMILY.Lexend(500,12),
        width: "100%",
      },
      childernTableContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height:521,
        overflow:"scroll"
      },
      childernTableRowContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      },
      childLabelStyle:{
        ...FONT_FAMILY.Lexend(500,14),
      },
      saveBtnContainerStyle:{
        marginTop:16,
        height:40,
        backgroundColor:secondColor(500)
      },
      textInputStyle:{
        width: 80,
        height: 40,
        boxShadow: "none",
        color: "black",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      childRowContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 40,
        borderBottom: "1px solid rgba(208, 213, 221, 1)",
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
