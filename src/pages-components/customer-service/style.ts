import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        paddingLeft: 20,
        paddingRight: 20,
        position: "relative" as "relative",
      },
      btnContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "fit-content",
        alignSelf: "flex-end",
        height: 40
      },
      insideStyle: {
        width: "600px",
         height: "fit-content",
       },
       mainModalContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent:"flex-start",
        alignItems:"center",
        gap:20,
        marginTop:15
       },
       multiTextInput:{ 
        height: "150px", 
        width: "100%", 
        border: "none", 
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)", 
        padding: 10, 
        overflow: "scroll"
       }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
