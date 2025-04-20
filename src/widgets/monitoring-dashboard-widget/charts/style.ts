import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      container: {
        padding: "10px 0px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.501967)",
        border: "1px solid #F8F9FA",
      },
      dropDownListStyle: {
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
        width: 200,
      },
      insideModalStyle: {
        width: "500px",
        height: "fit-content",
        padding: "25px",
      },
      fixBtn: {
        height: 35,
        color: "#ffa143",
        borderColor: "#ffa143",
        width: 40,
      },
      infoDiv: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
      },
    };
  }, [t]);
  return {
    classes,
  };
};
export { useStyle };
