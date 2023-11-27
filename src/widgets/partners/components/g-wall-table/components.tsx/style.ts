import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { neutralColor, primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      cardStyle: {
        textAlign: "center" as "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
       // width: "19%",
       // height: "90px",
        display: "flex",
        alignItems: "center",
        padding :"20px",
        justifyContent: 'space-between',
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(500, 20),
      },
      subTitleStyle: {
        color: primaryColor(700),
        ...FONT_FAMILY.Lexend(500, 14),
      },

      sectionTitle:{
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(500, 20),
        lineHeight: "25px",

      },
      sectionSubTitle:{
        color: neutralColor(600),
        ...FONT_FAMILY.Lexend(400, 16),
        lineHeight: "24px",
      },
      nameMemberStyle:{
        ...FONT_FAMILY.Lexend(500, 16),
       // lineHeight: "20px",
      },
      jobMemberStyle:{
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(400, 12),
        marginBottom: "5px",
      //  lineHeight: "15px",
      },
      infoStyle:{
        color: primaryColor(300),
        ...FONT_FAMILY.Lexend(500, 20),
        marginBottom: "5px",
      //  lineHeight: "15px",
      }
    
    
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
