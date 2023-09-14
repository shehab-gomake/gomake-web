import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { convertHeightToVH } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
        table: {
          overflow: "scroll",
          zIndex : -1,
          },
          sticky: {
            position:"sticky" as "sticky",
            left: 0,
            marginLeft: "20px",
            backgroundColor: primaryColor(50),
            minWidth:"200px",
            padding:"20px"
        
          },
          headerItem: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: primaryColor(700),
            textalign: "center",
            width:"10%",
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 22,
            paddingRight: 22,
          },
          header: {
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: primaryColor(50),
            lineHeight: "17.5px",
            ...FONT_FAMILY.Lexend(500, 14),
            position:"sticky" as "sticky",
            top:0,
          
            zIndex:3,
          },
          HeaderTable:{
            backgroundColor:"#EBECFF",
          },
          tableBody: {
            display: "flex",
            width: "100%",
            flexDirection: "column" as "column",
            alignitems: "center",
            textalign: "center",  
            
        
          },
          skeletonRowStyle: {
            marginTop: convertHeightToVH(10),
          },
          noDataContainer: {
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            color: secondColor(500),
            height: 200,
            lineHeight: "17.5px",
            ...FONT_FAMILY.Lexend(500, 22),
          },
     
    };
  }, []);
  return {
    clasess
  };
};
export { useStyle };
