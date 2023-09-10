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
        height: 60,
        backgroundColor: "#F6F6F6",
      },
      isSticky: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        height: 60,
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
        backgroundColor:"white",
        Zindex:1000000000,
      } 
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
