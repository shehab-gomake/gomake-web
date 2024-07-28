import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();

  const { t } = useTranslation();

  const clasess = useMemo(() => {
    return {
    btnContainer:{
      width: "fit-content",
      height: 40,
      marginBottom: 15,
      backgroundColor:secondColor(500)
  }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
