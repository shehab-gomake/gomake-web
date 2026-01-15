import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, secondColor, primarySecondaryBlend, theme } =
    useGomakeTheme();
  const classes = useMemo(() => {
    return {
      writeCommentContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "14px 29px",
        background: "var(--theme-bg-secondary,#F4F1F6)",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        flexWrap: "wrap" as "wrap",
        gap: 12,
      },
      btnContainer: {
        border: "1px solid #D0D5DD",
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: "#FFFFFF",
        color: "#344054",
        ...FONT_FAMILY.Inter(600, 14),
        height: 36,
        width: "fit-content",
        padding: "8px 14px",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      btnSecondContainer: {
        border: `1px solid ${primarySecondaryBlend(100)}`,
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: primarySecondaryBlend(100),
        color: primarySecondaryBlend(400),
        ...FONT_FAMILY.Inter(600, 14),
        height: "var(--theme-button-height, 40px)",
        width: "fit-content",
        padding: "10px",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      btnThirdContainer: {
        // border: `1px solid var(--theme-accent-color, ${primaryColor(500)})`,
        // backgroundColor: `var(--theme-accent-on-dark, ${primaryColor(500)})`,
        border: `1px solid ${primaryColor(500)})`,
        backgroundColor: primaryColor(500),
        boxShadow: "0px 1px 2px 0px #1018280D",
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: "var(--theme-button-height, 40px)",
        width: "fit-content",
        padding: "10px",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      btnSaveDraft: {
        // border: `1px solid var(--theme-accent-color, ${primaryColor(500)})`,
        // backgroundColor: `var(--theme-accent-on-dark, ${primaryColor(500)})`,
        border: `1px solid ${primaryColor(500)})`,
        backgroundColor: primaryColor(500),
        boxShadow: "0px 1px 2px 0px #1018280D",
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: "var(--theme-button-height, 40px)",
        width: "fit-content",
        padding: "10px",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      btnOrderNowContainer: {
        border: `1px solid ${secondColor(500)})`,
        boxShadow: "0px 1px 2px 0px #1018280D",
        backgroundColor: secondColor(500),
        color: "#FFFFFF",
        ...FONT_FAMILY.Inter(400, 14),
        height: "var(--theme-button-height, 40px)",
        width: "fit-content",
        padding: "10px",
        borderRadius: "var(--theme-radius-md, 8px)",
      },
      insideStyle: {
        width: "800px",
        height: 680,
      },
      statusLabel: {
        color: "#344054",
        ...FONT_FAMILY.Lexend(500, 14),
        width: "100%",
        textTransform: "capitalize",
        justifyContent: "center",
        boxSizing: "border-box",
        display: "flex",
        backgroundColor: "FFFFFF",
        "&:hover": {
          color: "#FFF",
          backgroundColor: "#344054",
        },
      },
      testStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
      },
      boxStyle: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "space-between",
        height: "100%",
      },
      saveBtn: {
        display: "flex",
        alignSelf: "flex-start",
        width: "100%",
      },
      firstSection: {
        minHeight: "65%",
        height: "65%",
        overflow: "auto",
      },
      iconStyle: {
        width: 62,
        height: 62,
        color: "#a1a2cd",
      },
      btnStyle: {
        ...FONT_FAMILY.Inter(600, 14),
        height: "var(--theme-button-height, 40px)",
        width: "fit-content",
        padding: "8px 14px",
        borderRadius: "var(--theme-radius-md, 8px)",
        lineHeight: "14px",
      },
    };
  }, [theme]);

  return {
    classes,
    primarySecondaryBlend,
  };
};

export { useStyle };
