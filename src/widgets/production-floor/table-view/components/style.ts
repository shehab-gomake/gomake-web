import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      headerContainer: {
        maxHeight: "35vh",
        overflowY: "auto" as "auto",
      },
      topBtns: {
        ...FONT_FAMILY.Inter(500, 13),
        padding: "4px 8px",
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
