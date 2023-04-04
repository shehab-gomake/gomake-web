import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import i18next from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: convertWidthToVW(30),
        paddingRight: convertWidthToVW(50),
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 16),
        top: 8,
      },
      rightSideContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: convertWidthToVW(32),
      },
      profileContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "center",
      },
      userNameStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#000",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
