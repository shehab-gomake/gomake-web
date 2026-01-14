import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor, primarySecondaryBlend, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      insideStyle: { width: "85%" },
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        padding: 15,
      },
      menuTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(300),
      },
      lineStyle: {
        width: "100%",
        height: 1,
        backgroundColor: "#EEEEEE",
      },
      menuRowStyle: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
      },
      rowTextStyle: {
        ...FONT_FAMILY.Lexend(500, 10),
        color: primarySecondaryBlend(300),
        fontSize: "12px",
        textDecoration: "unset",
        display: "block",
      },
      editModalStyle: {
        width: "25%",
        minWidth: "500px",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
        paddingTop: convertWidthToVW(15),
      },
      modalTitleStyle: {
        color: "black",
        ...FONT_FAMILY.Inter(500, 20),
      },
      inputLabelStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#344054",
        marginBottom: "4px",
      },
      descriptionStyle: {
        height: "120px",
        display: "flex",
        padding: "var(--spacing-lg, 12px) 14px",
        alignItems: "flex-start",
        gap: "var(--spacing-md, 8px)",
        flex: "1 0 0",
        alignSelf: "stretch",
        borderRadius: "var(--radius-md, 8px)",
        border: "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
        background: "var(--Colors-Background-bg-primary, #FFF)",
        boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
