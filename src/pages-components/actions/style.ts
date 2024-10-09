import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor,secondColor } = useGomakeTheme();
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
        marginBottom:20
      },
      menuContainer:{
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap:8
      },
      rowTextStyle:{
        ...FONT_FAMILY.Lexend(500,14),
        color:primaryColor(500)
      },
      multiLineTextInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
      },
      modalMainContainer:{
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems:"flex-start",
        padding:"15px 0px",
        gap:15
      },
      btnContainer:{
        width: "100%",
        height: 40,
        backgroundColor:secondColor(500),
        borderRadius: 4,
      }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
