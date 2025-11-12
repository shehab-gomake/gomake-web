import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  convertHeightToVH,
  convertWidthToVW,
  adaptPaddingLeft,
  adaptPaddingRight,
} from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const direction = t("direction");
  const { primaryColor, secondColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        gap: "20px",
        height: "100%",
      },
      title: {
        ...FONT_FAMILY.Inter(600, 24),
        color: primaryColor(900),
      },
    };
  }, [i18next.language, t, primaryColor]);
  return {
    classes,
  };
};
export { useStyle };

