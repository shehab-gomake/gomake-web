import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const {theme , secondColor}=useGomakeTheme()
  const classes = useMemo(() => {
    return {
        dropDownListStyle: {
            width: "100%",
            borderRadius: "4px",
            backgroundColor: "#FFF",
          },  
          dateStyle: {
            width: "50%",
            display: "flex",
            position: "relative" as "relative",
            ...FONT_FAMILY.Lexend(500, 18),
            color: secondColor(500),
            cursor: "pointer",
            alignItems : "center",
            justifyContent: "center"
          },
          datePickerContainer: {
            width:"50%",
            display: "flex",
            position: "absolute" as "absolute",
            top: 0,
            right: 100,
            visibility: "hidden" as "hidden",
          },
    };
  }, [i18next.language, t,theme]);
  return {
    classes,
  };
};
export { useStyle };
