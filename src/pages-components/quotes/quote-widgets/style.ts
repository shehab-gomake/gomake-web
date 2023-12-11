import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const {theme}=useGomakeTheme()
  const classes = useMemo(() => {
    return {
        dropDownListStyle: {
            width: "100%",
            borderRadius: "4px",
            backgroundColor: "#FFF",
            //border: "0px",
            //...FONT_FAMILY.Lexend(500, 14),
          },  
    };
  }, [i18next.language, t,theme]);
  return {
    classes,
  };
};
export { useStyle };
