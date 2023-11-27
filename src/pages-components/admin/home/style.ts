import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

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
        height: "100%",
        gap: 16,
        backgroundColor: "#FFFFFF",
      },
      firstRowContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        width: "100%",
        height:"50%",
        gap: 20,
        backgroundColor: "#FFFFFF",
        marginBottom: 15,
      },
      secondRowContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        width: "100%",
       // height:"50%",
        gap: 20,
        backgroundColor: "#FFFFFF",
        marginBottom: 15,
      },
      titleStyle: {
        ...FONT_FAMILY.Lexend(600, 25),
        color: primaryColor(500),
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
