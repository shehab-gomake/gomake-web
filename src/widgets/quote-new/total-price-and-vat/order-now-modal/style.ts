import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor,primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: {
        width: 860,
        borderRadius: 5,
        height: "400px",
      },
      headerStyle:{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap:30,
        marginTop:20
      },
      iconContainer:{
        width: 120,
        height: 120, 
        color: secondColor(500)
      },
      titleContainer:{
        display: "flex",
        ...FONT_FAMILY.Lexend(500,21),
        color:primaryColor(500),
        width: "66%",
        textAlign: "center" as "center"
      },
      mainBtnContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:20,
        width:"100%",
      },
      cancelContainer:{
        display: "flex",
        height: 40,
        width:"28%"
      },
      withNotificationContainer:{
        display: "flex",
        lineHeight: "20px",
        height: 40,
        width:"42%"
      },
      withoutNotificationContainer:{
        display: "flex",
        lineHeight: "20px",
        height: 40,
        width:"40%"
      }
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
