import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const useStyle = ({ headerWidth, index }: any) => {
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      headerNameStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#B5B7C0",
        width: headerWidth[index],
      },
    };
  }, [t, headerWidth, index]);
  return {
    clasess,
  };
};
export { useStyle };
