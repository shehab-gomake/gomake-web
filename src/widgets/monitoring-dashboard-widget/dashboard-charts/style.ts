import { adaptPaddingLeft, adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
const useStyle = () => {
  const { t } = useTranslation();
  const direction = t("direction");
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 10,
        padding: 16,
        ...adaptPaddingRight(direction, 24),
      },
      title: {
        ...FONT_FAMILY.Lexend(500, 22),
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 10,
      },
      printBtn: {
        width: "fit-content",
        height: 40,
        borderRadius: 8,
        border: "none",
      },
      autoCompleteStyle: {
        width: "200px",
        height: 40,
        border: "1px solid #D0D5DD",
        boxShadow: "none",
      },
      settingBtn: {
        width: "fit-content",
        height: 40,
        borderRadius: 8,
        backgroundColor: "transparent",
        border: "1px solid #E0E0E0",
      },
      chartBtn: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "fit-content",
        height: 40,
        borderRadius: "8px !important",
        paddingX: 1,
        border: "1px solid #E0E0E0",
        backgroundColor: "transparent",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      },
      menuContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      menuItemReviewContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 8,
        justifyContent: "flex-start",
        alignItems: "center",
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
      menuItemReviewText: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
      secSubContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        flexWrap: "wrap" as "wrap",
        gap: "32px",
        padding: "24px 21px 24px 32px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 20px rgba(238, 238, 238, 0.5)",
        border: "1px solid #F8F9FA",
        justifyContent: "space-between",
        alignItems: "flex-start",
      },
      piesContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "20px",
        flex: 1,
        minWidth: "300px",
        maxWidth: "35vw",
        alignItems: "center",
      },
      labelStyle: {
        color: "#333",
        fontWeight: 600,
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
