import { useMemo } from "react";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const { primaryColor, secondColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "transparent",
      },
      categoryNameStyle: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
        marginBottom: 16,
      },
      firstContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 16,
        width: "100%",
        flexWrap: "wrap" as "wrap",
        marginBottom: 24,
      },
      itemOnFirstContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "180px",
        minWidth: 180,
        position: "relative" as "relative",
      },
      itemGropupsContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        width: "380px",
        position: "relative" as "relative",
      },
      textInputStyle: {
        width: "100%",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
      },
      selectColorStyle: {
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px solid #000000",
        alignSelf: "flex-end",
      },
      dropDownListStyle: {
        //width:"100%"
        width: "180px",
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        // boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
      },
      multiSelectStyle: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        borderRadius: 4,
        display: "flex",
        border: "0px",
        flexDirection: "row" as "row",
        alignitems: "center",
        justifyContent: "center",
        height: 40,
      },
      labelTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryColor(900),
      },
      requierdInput: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
      plusInput: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
        cursor: "pointer",
        paddingLeft: 5,
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 10,
      },
      goToListBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: `1px solid ${secondColor(500)} `,
        borderRadius: "4px",
        padding: "10px 32px",
        color: secondColor(500),
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer",
        height: 40,
      },
      addNwBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "4px",
        padding: "10px 32px",
        color: "white",
        backgroundColor: secondColor(500),
        ...FONT_FAMILY.Lexend(500, 16),
        cursor: "pointer",
        height: 40,
      },
      button: {
        height: 32,
        width: 32,
        backgroundColor: primaryColor(300),
        color: "white",
        "&:hover": {
          backgroundColor: primaryColor(300),
          color: "white",
        },
      },
      avatar: {
        width: "36px",
        height: "36px",
        marginLeft: "10px",
      },
      attachmentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        width: "100%",
        cursor: "pointer",
        backgroundColor: "#FFF",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
      },
      IconButtonStyle: {
        background: primaryColor(100),
        width: "24px",
        height: "24px",
      },
      labelStyle: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: "#000",
        overflow: "hidden",
        paddingRight: 10,
        cursor: "pointer",
      },
      attachmentStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        height: "40px",
        borderRadius: "4px",
      },
      fileInputStyle: {
        boxSizing: "border-box" as "border-box",
        borderRadius: "4px",
        height: "40px",
        padding: "7px",
        ...FONT_FAMILY.Lexend(300, 14),
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
        color: "#8283BE",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
      },
    };
  }, [i18next.language, t]);
  return {
    clasess,
  };
};
export { useStyle };
