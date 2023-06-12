import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { convertWidthToVW } from "@/utils/adapter";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();
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
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: primaryColor(50),
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      bodyRow: {
        display: "flex",
        width: "100%",
        minHeight: 60,
        paddingTop: 20,
        paddingBottom: 20,
        textAlign: "center" as "center",
      },
      secondRow: {
        display: "flex",
        width: "100%",
        minHeight: 60,
        backgroundColor: "#F6F6F6",
        paddingBottom: 20,
        paddingTop: 20,
        textAlign: "center" as "center",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
