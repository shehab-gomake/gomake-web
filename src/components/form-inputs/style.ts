import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { leftRightAdapter, convertWidthToVW } from "@/utils/adapter";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, secondColor, errorColor } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";

  const classes = useMemo(() => {
    return {
      container: {
        width: "100%",
        padding: "16px 0",
        gap: 16,
      },
      inputsRow: {
        display: "flex",
        alignItems: "center" as "center",
        gap: "16px",
      },
      inputs: {
        boxSizing: "border-box" as "border-box",
        borderRadius: "var(--theme-radius-md, 4px)",
        height: "var(--theme-input-height, 40px)",
        // padding: dir === "ltr" ? "6.5px 14px" : "6.5px 0px",
        paddingLeft: dir === "ltr" ? 0 : "14px",
      },
      fileInputStyle: {
        width: "100%",
        boxSizing: "border-box" as "border-box",
        borderRadius: "var(--theme-radius-md, 4px)",
        height: "var(--theme-input-height, 40px)",
        padding: "7px",
        ...FONT_FAMILY.Lexend(300, 14),
        display: "flex",
        alignItems: "center",
        boxShadow:
          "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
        color: primaryColor(300),
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        border: "var(--theme-input-border, none)",
      },
      button: {
        width: "fit-content" as "fit-content",
        height: "var(--theme-button-height, 40px)",
      },
      deleteIcon: {
        cursor: "pointer",
        alignSelf: "flex-end",
      },
      addColor: {
        alignSelf: "flex-end",
      },
      inputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 10,
      },
      inputContainerRow: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse" as "row-reverse",
      },
      inputLbl: {
        color: primaryColor(900),
        ...FONT_FAMILY.Lexend(600, 14),
        display: "flex",
        alignItems: "flex-end",
      },
      multiInputLabel: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
      },
      multiInputContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: 16,
        width: "100%",
      },
      iconColor: secondColor(500),
      required: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: errorColor(500),
      },
      subSectionHeader: {
        ...FONT_FAMILY.Lexend(600, 16),
        color: secondColor(500),
      },
      searchInput: {
        height: "var(--theme-input-height, 40px)",
        minWidth: convertWidthToVW(200),
        borderRadius: 10,
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 16),
        top: 10,
      },
      selectBtn: {
        height: 33.29,
        ...FONT_FAMILY.Lexend(500, 12),
      },
      multiSelectOption: {
        width: "100%",
        ...FONT_FAMILY.Lexend(400, 14),
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
      },
    };
  }, [theme, t]);
  return {
    classes,
  };
};
export { useStyle };
