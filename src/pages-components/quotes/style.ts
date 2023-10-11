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
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap:20,
          marginTop:20
      },
      filtersContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:20,
        width:"100%"
      },
      statusFilterContainer:{
        width:"15%",
      },
      textInputStyle:{
        width:"100%"
      }
  
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
