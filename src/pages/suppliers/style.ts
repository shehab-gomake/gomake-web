import { adaptPaddingLeft } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        height: "100%",
        overflowY: "auto" as "auto",
      },
      headerStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
      },
      footerStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        ...adaptPaddingLeft(direction, 20),
      },
      btnStyle: {
        width: "100%",
        borderRadius: "8px",
        height: "40px",
      },
      insideModalStyle: {
        width: "500px",
        height: "fit-content",
        padding: "25px",
      },
      modalTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        color: "#000000",
        paddingBottom: "10px",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
