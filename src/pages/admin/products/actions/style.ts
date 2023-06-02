import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
      },
      tableHeaderStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: primaryColor(50),
        border: " 1px solid #EBECFF",
      },
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(800),
        width: "150px",
      },

      row: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        paddingLeft: 83,
        paddingRight: 54,
        backgroundColor: "#FFF",
        border: " 1px solid #EBECFF",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
