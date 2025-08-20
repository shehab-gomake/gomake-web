import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
const useStyle = () => {
  const { t } = useTranslation();
  const { theme, primaryColor } = useGomakeTheme();

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
        width: "20%",
      },
      buttonContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: 10,
        width: "100%",
        justifyContent: "flex-end",
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
      },
      menuItemReviewText: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#667085",
      },
      dropDownListStyle: {
        borderRadius: 4,
        height: 40,
        backgroundColor: "#FFF",
        border: "0px",
        boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
        width: 200,
      },

      statusFilterContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
        minWidth: "fit-content",
        width: "150px",
      },
      filterLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        height: 21,
      },
      fixBtn: {
        color: "#000",
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "fit-content",
        height: 40,
        borderRadius: "8px !important",
        padding: 1,
        border: "1px solid #E0E0E0",
        backgroundColor: "transparent",
        cursor: "pointer",
        "&:hover": {
          border: "1px solid #E0E0E0",
          backgroundColor: "#f5f5f5",
        },
        "&.rollback": {
          color: "#d32f2f",
          border: "1px solid #d32f2f",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#ffebee",
            border: "1px solid #d32f2f",
          },
        },
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
