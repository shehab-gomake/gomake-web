import { useGomakeTheme } from "@/hooks/use-gomake-thme";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      searchInput: {
        display: "flex",
        flexDirection:!isRTL? "row" as "row":"row-reverse"as "row-reverse",
        justifyContent: "flex-end",
        alignItems: "center",
        // width: "100%",
      },
    };
  }, [isRTL,dir]);
  return {
    clasess,
  };
};
export { useStyle };
