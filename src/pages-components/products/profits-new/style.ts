import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { convertHeightToVH } from "@/utils/adapter";
import { HEADER_HEIGHT, SCREEN_HEIGHT } from "@/utils/layout-config";

const useStyle = () => {
  const { t } = useTranslation();

  const clasess = useMemo(() => {
    return {
      mainGridContainer: {
        display: "grid" as "grid",
        gridTemplateRows: "auto 1fr",
        background: "#ECECEC",
        padding: 10,
        gridGap: "8px",
        maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        height: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        overflowY: "hidden" as "hidden",
      },
      bodyGridContainer: {
        display: "grid",
        gridTemplateColumns: "60% auto",
        gridGap: "9px",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
