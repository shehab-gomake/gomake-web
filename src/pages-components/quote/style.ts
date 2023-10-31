import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        position: "relative" as "relative",
      },
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 5,
        marginBottom: 4,
      },
      titleQuateContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 15,
      },
      quoteNumberStyle: {
        ...FONT_FAMILY.Lexend(600, 20),
        color: primaryColor(500),
      },
      rightSideHeaderContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 34,
      },
      uploadContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        background: "#DCDCEC",
        borderRadius: 4,
        gap: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        cursor: "pointer",
      },
      uploadTextStyle: {
        ...FONT_FAMILY.Lexend(500, 16),
        color: "#101020",
      },
      scrollContainer: {
        width: "100%",
        height: 450,
        overflow: "scroll" as "scroll",
        boxShadow: "0px 4px 6px 0 rgba(103, 103, 103, 0.08)",
        marginTop: 20,
        borderRadius: 8,
      },
      deleverdDate: {
        display: "flex",
        position: "relative" as "relative",
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
        cursor: "pointer",
      },
      datePickerContainer: {
        display: "flex",
        position: "absolute" as "absolute",
        top: 0,
        right: 100,
        visibility: "hidden" as "hidden",
      },
      tableContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 26,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 32,
        marginTop: 20,
      },
      btnContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
      },
      btnTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(500),
      },
      HeaderConfirmPage : {
        backgroundColor: "#F4F1F6",
        width:"100%",
        height:"80px",
        position:"fixed" as "fixed",
        padding:0,
        margin:0,
        top:0
      },
      GomakeIconStyle:{
        marginTop:22,
        marginLeft:80
      },
      MainContainerInConfirmPage:{
        ...FONT_FAMILY.Lexend(600, 16),
        width:"1360px",
        height:"788px",
        marginLeft:'280px',
        gap:"24px",
        marginTop:"120px"
      },
    
      '.css-rorn0c-MuiTableContainer-root':{
        borderRadius:"10px"
      },
      '.css-rqglhn-MuiTable-root' :  {
        borderCollapse: 'unset',
      },
      mainTitleStyle:{
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
      },
      subTitleStyle:{
        ...FONT_FAMILY.Lexend(400, 16),
        color:"#667085",
      },
        height: 42,
      subTitleStyle2:{
        ...FONT_FAMILY.Lexend(400, 16),
        color:"black",
      }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
