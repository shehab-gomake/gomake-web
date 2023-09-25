import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      headerStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
