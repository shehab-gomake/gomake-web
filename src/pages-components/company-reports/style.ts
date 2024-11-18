import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { secondColor } = useGomakeTheme();

  const { t } = useTranslation();

  const classes = useMemo(() => {
    return {
      btnContainer: {
        width: "fit-content",
        height: 40,
        marginBottom: 15,
        backgroundColor: secondColor(500),
      },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 20,
        padding: "0px 20px 20px 20px",
        overflowY: "scroll" as "scroll",
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 13),
        color: "rgba(130, 131, 190, 1)",
        textDecoration: "unset",
        display: "block",
      },
      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        minWidth: "20%",
        width: "fit-content",
      },
      textInputStyle: {
        width: "100%",
        height: "40px",
        border: "none",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
