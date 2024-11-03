import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { adaptMarginRight, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const classes = useMemo(() => {
    return {
      headerFilterContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        backgroundColor: "#FFF",
        alignItems: "center",
        gap: "20px",
        padding: "12px 0",
      },
      filtersCardBox: {
        width: "60%",
        maxHeight: "100px",
        maxWidth: "60%",
        overflowX: "scroll",
        overflowY: "scroll",
        display: "flex",
        flexWrap: "nowrap",
        gap: "5px",
        whiteSpace: "nowrap",
        borderRadius: "4px",
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "flex-end",
      },
      paperStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        zIndex: 99999,
        padding: "10px",
        gap: "10px",
        marginTop: "40px",
        marginLeft: isRtl ? "1px" : "10px",
        marginRight: isRtl ? "10px" : "0px",
        minWidth: convertWidthToVW(200),
        height: "fit-content",
        maxHeight: "216px",
        overflowX: "scroll",
        overflowY: "scroll",
        position: "absolute" as "absolute",
        borderRadius: "var(--radius-md, 8px)",
        border: "1px solid var(--Colors-Border-border-secondary, #EAECF0)",
        background: "var(--Colors-Background-bg-primary, #FFF)",
        boxShadow:
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
      },
      missionRowStyle: {
        display: "flex",
        padding: "8px",
        alignItems: "center",
        flex: "1 0 0",
        color: "var(--colors-text-text-primary-900, #101828)",
        fontStyle: "normal",
        lineHeight: "24px",
        ...FONT_FAMILY.Inter(500, 16),
      },
    };
  }, [theme, t]);
  return {
    classes,
  };
};
export { useStyle };
