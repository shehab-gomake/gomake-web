import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { convertHeightToVH } from "@/utils/adapter";
import { HEADER_HEIGHT, SCREEN_HEIGHT } from "@/utils/layout-config";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainGridContainer: {
        display: "grid" as "grid",
        gridTemplateRows: "auto 1fr",
        background: neutralColor(100),
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
  }, []);
  return {
    classes,
  };
};
export { useStyle };
