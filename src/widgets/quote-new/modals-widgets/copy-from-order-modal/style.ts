import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const {t}=useTranslation()
  const { primaryColor,secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: "50%",
        borderRadius: 5,
        height: "auto",
        maxHeight:670,
        overflow: "hidden",
        background:"#F6F6F6",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginTop:20
      },
      headerContainer:{ width: "100%", height: 80 },
      filtersContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
      },
      searchContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:10
      },
      searchLabelStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        ...adaptPaddingRight(t("direction"), 8),
      },
      switchiesContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems:"center",
        gap:10
      },
      switchLabelContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems:"center",
        gap:5
      },
      labelSwitchStyle:{
        ...FONT_FAMILY.Lexend(400,12),
        color:primaryColor(900)
      },
      footerModalContainer:{ 
      display: "flex",
      flexDirection: "row" as "row",
      justifyContent:"space-between",
      alignItems:"center",
      height: 50, 
      width: "100%",
      },
      bodyContainer: { width: "100%", height: "auto", maxHeight: 410, overflow: "scroll" },
      selectAllContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent:"flex-end",
        alignItems:"center",
      },
      selectAllStyle:{
        ...FONT_FAMILY.Lexend(400,12),
      },
      totalStyle:{
        ...FONT_FAMILY.Lexend(400,12),
        color:secondColor(500)
      },
      btnContainer:{
        backgroundColor:secondColor(500),
        color:"#FFF",
        border:"none",
        ...FONT_FAMILY.Lexend(500,16),
        height:40,
        width:"fit-content"
      },
      tableRowStyle: {
        height:"44px",
        background: "#8283BE",
        color: "white",
      },
      tableHeaderStyle: {
        borderRight: "1px solid #EAECF0",
        color: "#FFF",
        textAlign: "center" as "center",
        backgroundColor: "inherit",
        ...FONT_FAMILY.Inter(400, 12),
      },
      cellContainerStyle: {
        textAlign: "center" as "center",
        padding: "0px 24px",
      },
      cellTextInputStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      dateStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        color:primaryColor(500)
      },
      dateSelectAllContainer:{
        display:"flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom:5
      }
    };
  }, [t]);
  return {
    classes,
  };
};
export { useStyle };
