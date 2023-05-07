import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { convertWidthToVW } from "@/utils/adapter";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();

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
        width: "100%",
      },
      addBtnStyle: {
        display: "flex",
        width: 340,
      },
      btnStyle: {
        borderRadius: 4,
        backgroundColor: secondColor(500),
        height: 40,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
