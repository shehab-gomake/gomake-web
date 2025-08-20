import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  adaptMarginRight,
  adaptPaddingLeft,
  adaptPaddingRight,
  convertWidthToVW,
} from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mui/material";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRtl = dir === "rtl";
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  const classes = useMemo(() => {
    return {
      headerFilterContainer: {
        display: "flex",
        ...(isMobileScreen && { flexWrap: "wrap" as "wrap" }),
        flexDirection: "row" as "row",
        backgroundColor: "#FFF",
        alignItems: "center",
        gap: isMobileScreen ? "2px" : "20px",
        padding: "12px 0",
        paddingRight: "6px",
        ...(isMobileScreen && { ...adaptPaddingRight(dir, 5) }),
        ...(isMobileScreen && { rowGap: "10px" }),
      },
      filtersCardBox: {
        width: "90%",
        maxWidth: "90%",
        maxHeight: "100px",
        ...(isMobileScreen
          ? { width: "100%", maxWidth: "100%", ...adaptPaddingLeft(dir, 1) }
          : { width: "90%", maxWidth: "90%" }),

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
      labelList: {
        display: "inline-block",
        maxWidth: "280px", // Set desired max width
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        verticalAlign: "middle",
      },
      modalContainer: { height: 'fit-content' },
      modalMainContainer: { display: 'flex', flexDirection: 'column' as 'column', gap: '10px' },
      checkboxContainer: { display: 'flex', alignItems: 'center' as 'center', gap: '8px' },
      usersContainer: { display: 'flex', flexDirection: 'column' as "column", gap: '10px', minHeight: "200px", maxHeight: "300px", overflowY: "auto" as "auto" },
      userContainer: { display: 'flex', alignItems: 'center' as 'center', gap: '8px' },
      buttonContainer: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "10px" },
      inputContainer: { display: "flex", flexDirection: "column" as "column", gap: "10px", marginBottom: "15px" }

    };
  }, [theme, t, isMobileScreen]);
  return {
    classes,
  };
};
export { useStyle };
