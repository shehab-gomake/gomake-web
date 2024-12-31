import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor, errorColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 24,
      },
      autoCompleteSelectedSectionName: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "flex-end",
        padding: "8px 12px",
        width: 140,
        height: 36,
        border: "1px solid #D0D5DD",
        borderRadius: 8,
        boxShadow: "none",
        backgroundColor: "#FFF",
        color:"#344054",
        ...FONT_FAMILY.Inter(500, 14)
      }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
