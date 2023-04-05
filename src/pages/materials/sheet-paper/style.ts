import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { convertWidthToVW } from "@/utils/adapter";

const useStyle = () => {
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: convertWidthToVW(50),
      },
      autoComplateStyle: {
        width: convertWidthToVW(200),
      },
      tableContainer: {
        width: "85%",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
