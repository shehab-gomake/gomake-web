import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {};
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
