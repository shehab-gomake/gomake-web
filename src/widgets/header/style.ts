import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import { convertWidthToVW, leftRightAdapter } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 24,
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
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
        // gap: 8,
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
