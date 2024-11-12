import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
const useStyle = () => {
  const {t} = useTranslation()
  const direction = t('direction');
  const classes = useMemo(() => {
    return {
      mainContainer:{
        display: 'flex',
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap:10,
        padding:16,
        ...adaptPaddingRight(direction, 24),
      },
      title:{
        ...FONT_FAMILY.Lexend(500,22)
      },
      buttonContainer:{
        display:"flex",
        flexDirection:"row" as "row",
        gap:10
      },
      printBtn:{
        width:"fit-content",
        height: 40,
        borderRadius:8,
        border:"none"

      },
      autoCompleteStyle:{
        width:"200px",
        height:40,
        border:"1px solid #D0D5DD",
        boxShadow:"none"

      },
      settingBtn:{
        width:"fit-content",
        height: 40,
        borderRadius:8,
        backgroundColor:"transparent",
        border:"1px solid #E0E0E0"
      },
      menuContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      menuItemReviewContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 8,
        justifyContent: "flex-start",
        alignItems: "center"
      },
      menuItemReviewText: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
