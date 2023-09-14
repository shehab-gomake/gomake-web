import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width }: any) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      bodyRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        height: 60,
      },
      secondRow: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
  
      },
      isSticky: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
       
      },
      secondRowSticky: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
      
  
      },
      rowItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(400, 12),
        lineHeight: "15px",
        color: primaryColor(500),
        textAlign: "center" as "center",
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 22,
        paddingRight: 22,
        width: `${width}`,
      },
      table: {
        minWidth: 650
      },
      sticky: {
        position:"sticky" as "sticky" ,
        left: 0,
        marginLeft:20,
        zIndex:1,
        backgroundColor:"inherit",
        minWidth:"200px",
      } 
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
