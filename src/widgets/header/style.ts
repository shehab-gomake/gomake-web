import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {convertHeightToVH, convertWidthToVW, leftRightAdapter} from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { t } = useTranslation();
  const { neutralColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 7,
        height: convertHeightToVH(50),
        maxHeight: convertHeightToVH(50)
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        height: 30,
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 16),
        top: 5,
      },
      rightSideContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
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
      mainMenuContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",

        gap: 10,
      },
      accountTextStyle: {
        width: "100%",
        ...FONT_FAMILY.Lexend(700, 11),
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
        color: neutralColor(600),
      },
      imgNameContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        gap: 8,
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 0,
      },
      nameTextStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: neutralColor(600),
      },
      emailTextStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: neutralColor(600),
      },
      manageAccountStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      manageAccountTextStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
      },
      logoutContainer: {
        width: "100%",
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
      },
      lineContainer: {
        display: "flex",
        width: "100%",
        height: 1,
        backgroundColor: "#cccccc",
      },
      avatarProps: {
        width: '30px',
        height: '30px',
        fontSize: '12px'
      }
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
