import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { secondColor,errorColor,primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: {
        width: 860,
        borderRadius: 5,
        height: "400px",
      },
      mainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap:20,
        marginTop:30
      },
      iconContainer:{
        width: 120,
        height: 120, 
        color: errorColor(500)
      },
      titleContainer:{
        display: "flex",
        ...FONT_FAMILY.Lexend(500,24),
        color:primaryColor(500),
        width: "70%",
        textAlign: "center" as "center"
      },
      mainBtnContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:20,
        width:"100%"
      },
      cancelContainer:{
        display: "flex",
        backgroundColor:secondColor(500),
        height: 40,
        width:"30%"
      },
      withNotificationContainer:{
        display: "flex",
        backgroundColor:secondColor(500),
        height: 40,
        width:"40%"
      },
      withoutNotificationContainer:{
        display: "flex",
        backgroundColor:secondColor(500),
        height: 40,
        width:"40%"
      }
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
