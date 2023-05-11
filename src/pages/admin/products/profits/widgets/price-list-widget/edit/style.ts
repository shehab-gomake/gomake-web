import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      mainCointaner: {
        width: "100%",
        display: "flex",
      },
      editCointaner: {
        ...FONT_FAMILY.Lexend(400, 14),
        fontStyle: "normal",
        lineHeight: "18px",
        color: primaryColor(300),
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
