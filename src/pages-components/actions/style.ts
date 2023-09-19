import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
