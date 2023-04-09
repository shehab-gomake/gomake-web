import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { convertWidthToVW } from "@/utils/adapter";

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
