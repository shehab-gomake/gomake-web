import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

import {
  convertHeightToVH,
  convertWidthToVW,
  leftRightAdapter,
} from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { HEADER_HEIGHT } from "@/utils/layout-config";

const useStyle = () => {
  const { t } = useTranslation();
  const { neutralColor, primaryColor, successColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 7,
        paddingTop: 10,
        height: convertHeightToVH(HEADER_HEIGHT),
        maxHeight: convertHeightToVH(HEADER_HEIGHT),
        backgroundColor: "#FFFFFF",
        paddingLeft: 20,
        paddingRight: 12,
      },
      searchInputContainer: {
        width: convertWidthToVW(375),
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
        height: 40,
        alignSelf: "flex-start",
        display: "flex",
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
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 14,
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
      mainMenuContainer2: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "466px",
        gap: 10,
        overflow: "visible",
      },
      accountTextStyle: {
        width: "100%",
        ...FONT_FAMILY.Lexend(700, 11),
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
        color: neutralColor(600),
      },
      notificationTextStyle: {
        width: "100%",
        ...FONT_FAMILY.Lexend(500, 14),
        padding: 10,
        paddingLeft: 16,
        paddingRight: 16,
        color: neutralColor(600),
      },
      footerTextStyle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: primaryColor(200),
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
        width: "30px",
        height: "30px",
        fontSize: "12px",
      },
      menuItemTextStyle: {
        display: "flex",
        width: "100%",
        ...FONT_FAMILY.Lexend(400, 16),
        color: primaryColor(900),
        paddingTop: "10px",
        paddingLeft: "10px",
      },
      textStyle: {
        whiteSpace: "pre-wrap" as "pre-wrap", // Preserve newlines and spaces
        wordWrap: "break-word" as "break-word",
        ...FONT_FAMILY.Lexend(400, 16),
        color: primaryColor(900),
      },
      subTextStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#A5ACB8",
        padding: "0px 0px 0px 64px",
      },
      menuItemContainer: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
        display: "flex",
        alignItems: "flex-start",
      },
      footerItemContainer: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: neutralColor(600),
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      acceptBtnStyle: {
        width: "64px",
        height: "28px",
        backgroundColor: successColor(500),
      },
      rejectBtnStyle: {
        width: "64px",
        height: "28px",
        color: "#3C4257",
        borderColor: "#DDDEE1",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
