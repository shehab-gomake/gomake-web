import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        padding: "0px 20px 20px 20px",
      },
      tableTitleContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 10,
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(700, 14),
        color: primaryColor(500),
        paddingLeft: 5,
      },
      totalStyle: {
        ...FONT_FAMILY.Lexend(700, 14),
        color: primaryColor(500),
        paddingRight: 5,
        display: "flex",
        alignItems: "right",
        justifyContent: "flex-end",
        width: "100%",
        marginTop: 10,
        marginBottom: 20,
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
