import { adaptPaddingLeft } from "@/utils/adapter";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const direction = t('direction');
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
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
