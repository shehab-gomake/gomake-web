import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      maonContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
      },
      headerStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
