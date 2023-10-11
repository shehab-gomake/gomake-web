import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

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
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap:20,
        width:"100%"
      },
      selectedFilterContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap:20,
        width:"70%"
      },
      statusFilterContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap:10,
        width:"25%",
      },
      filterLabelStyle:{
        ...FONT_FAMILY.Lexend(500,14)
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
