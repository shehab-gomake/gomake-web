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
        height: "100%",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#F6F6F6",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
      },
      pageTitle: {
        ...FONT_FAMILY.Inter(600, 24),
        color: primaryColor(900),
        marginBottom: 0,
        marginTop: 0,
        lineHeight: 1,
      },
      titleContainer: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
      },
      contentWrapper: {
        display: "flex",
        flexDirection: "row" as "row",
        flex: 1,
        minHeight: 0,
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#F6F6F6",
      },
      sidebar: {
        width: "25%",
        minWidth: "250px",
        maxWidth: "300px",
        height: "100%",
        backgroundColor: "#F6F6F6",
        display: "flex",
        flexDirection: "column" as "column",
        overflow: "hidden",
      },
      sidebarTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        color: primaryColor(900),
        padding: "20px 16px",
        backgroundColor: "transparent",
      },
      foldersList: {
        flex: 1,
        overflowY: "auto" as "auto",
        padding: "8px 0",
        paddingTop: "20px",
      },
      folderItem: {
        display: "flex",
        flexDirection: "column" as "column",
      },
      folderHeader: {
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: primaryColor(50),
        },
      },
      chevronIcon: {
        fontSize: "20px",
        color: primaryColor(600),
        marginRight: "8px",
        transition: "transform 0.2s ease",
      },
      folderName: {
        ...FONT_FAMILY.Inter(500, 14),
        color: primaryColor(900),
        flex: 1,
      },
      articlesList: {
        paddingLeft: "44px", // Align with folder name (20px icon + 8px margin + 16px padding)
        paddingRight: "16px",
        display: "flex",
        flexDirection: "column" as "column",
      },
      articleItem: {
        ...FONT_FAMILY.Inter(400, 14),
        color: primaryColor(700),
        padding: "10px 12px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: primaryColor(50),
          color: primaryColor(900),
        },
      },
      articleItemSelected: {
        backgroundColor: primaryColor(100),
        color: primaryColor(900),
        fontWeight: 500,
      },
      loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      },
      emptyArticles: {
        ...FONT_FAMILY.Inter(400, 12),
        color: primaryColor(500),
        padding: "12px",
        fontStyle: "italic",
      },
      divider: {
        width: "1px",
        backgroundColor: "transparent",
        height: "100%",
        flexShrink: 0,
      },
      contentArea: {
        flex: 1,
        height: "100%",
        backgroundColor: "#F6F6F6",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column" as "column",
      },
      articleContent: {
        flex: 1,
        overflowY: "auto" as "auto",
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        width: "100%",
      },
      articleBody: {
        ...FONT_FAMILY.Inter(400, 16),
        color: primaryColor(800),
        lineHeight: "1.8",
      },
      articleBodyContent: {
        "& img": {
          maxWidth: "100%",
          height: "auto",
          borderRadius: "8px",
          margin: "24px 0",
        },
        "& iframe": {
          maxWidth: "100%",
          height: "auto",
          aspectRatio: "16 / 9",
          margin: "24px 0",
          borderRadius: "8px",
        },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          margin: "24px 0",
        },
        "& th, & td": {
          border: `1px solid ${primaryColor(200)}`,
          padding: "12px",
        },
        "& th": {
          backgroundColor: primaryColor(50),
          fontWeight: 600,
          ...FONT_FAMILY.Inter(600, 14),
        },
        "& h1": {
          ...FONT_FAMILY.Inter(600, 32),
          color: primaryColor(900),
          marginTop: "32px",
          marginBottom: "16px",
        },
        "& h2": {
          ...FONT_FAMILY.Inter(600, 24),
          color: primaryColor(900),
          marginTop: "28px",
          marginBottom: "14px",
        },
        "& h3": {
          ...FONT_FAMILY.Inter(600, 20),
          color: primaryColor(900),
          marginTop: "24px",
          marginBottom: "12px",
        },
        "& h4, & h5, & h6": {
          ...FONT_FAMILY.Inter(600, 16),
          color: primaryColor(900),
          marginTop: "20px",
          marginBottom: "10px",
        },
        "& p": {
          marginBottom: "16px",
        },
        "& ul, & ol": {
          marginBottom: "16px",
          paddingLeft: "32px",
        },
        "& li": {
          marginBottom: "8px",
        },
        "& code": {
          backgroundColor: primaryColor(50),
          padding: "2px 6px",
          borderRadius: "4px",
          ...FONT_FAMILY.Inter(400, 14),
          fontFamily: "monospace",
        },
        "& pre": {
          backgroundColor: primaryColor(50),
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto",
          margin: "16px 0",
        },
        "& blockquote": {
          borderLeft: `4px solid ${primaryColor(300)}`,
          paddingLeft: "16px",
          margin: "16px 0",
          fontStyle: "italic",
          color: primaryColor(700),
        },
      },
      emptyContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center" as "center",
      },
      emptyContentIcon: {
        fontSize: "64px",
        marginBottom: "16px",
      },
      emptyContentTitle: {
        ...FONT_FAMILY.Inter(600, 20),
        color: primaryColor(700),
        marginBottom: "8px",
      },
      emptyContentText: {
        ...FONT_FAMILY.Inter(400, 14),
        color: primaryColor(600),
      },
    };
  }, [i18next.language, t, primaryColor, secondColor]);
  return {
    classes,
  };
};
export { useStyle };

