import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, neutralColor, secondColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      filterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContainer: "flex-start",
        alignItems: "center",
        justifyContent: "space-around",
      },
      autoComplateStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 160,
        border: "1px solid #FFFFFF",
        backgroundColor: "#FFFFFF",
        paddingTop: 4,
        paddingBottom: 4,
        paddingRight: 0,
        paddingLeft: 0,
        color: secondColor(400),
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
      },
      headerMainCointaner: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      },
      listTitle: {
        width: 275,
        height: 25,
        ...FONT_FAMILY.Lexend(700, 20),
        fontStyle: "normal",
        lineHeight: "25px",
        display: "flex",
        alignItems: "center",
        textalign: "center",
        color: primaryColor(500),
      },
      filtersCointaner: {
        display: "flex",
        gap: 20,
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
