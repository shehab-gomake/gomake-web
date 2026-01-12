import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      insideStyle: {
        minWidth: "fit-content",
        width: "30%",
        borderRadius: "var(--theme-radius-lg, 8px)",
        height: "auto",
        maxHeight: 500,
        backgroundColor: "var(--theme-bg-primary, #FFFFFF)",
      },
      modalTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        color: "var(--theme-text-primary, #000000)",
        paddingBottom: "10px",
      },
      scrollContainer: {
        height: 330,
        overflow: "auto",
        padding: "16px",
        width: "100%",
        backgroundColor: "var(--theme-bg-body, #F6F6F6)",
        borderRadius: "var(--theme-radius-md, 4px)",
      },
      addButtonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 16,
        cursor: "pointer",
        padding: "8px",
        borderRadius: "var(--theme-radius-md, 4px)",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "var(--theme-bg-tertiary, rgba(0, 0, 0, 0.04))",
        },
      },
      rowContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: 12,
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
        padding: "8px",
        borderRadius: "var(--theme-radius-md, 4px)",
        backgroundColor: "var(--theme-bg-primary, #FFFFFF)",
        border: `1px solid var(--theme-border-color, ${neutralColor(200)})`,
      },
      textValueContainer: {
        display: "flex",
        alignItems: "center",
        flex: 1,
        minWidth: 0,
      },
      textLabel: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "var(--theme-text-secondary, #666666)",
        marginBottom: 4,
      },
      deleteButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: "4px",
        borderRadius: "var(--theme-radius-sm, 4px)",
        transition: "background-color 0.2s ease",
        minWidth: 32,
        height: 32,
        "&:hover": {
          backgroundColor:
            "var(--theme-error-bg-hover, rgba(172, 21, 21, 0.1))",
        },
      },
      updateBtn: {
        marginTop: 16,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingTop: 16,
        borderTop: `1px solid var(--theme-border-color, ${neutralColor(200)})`,
      },
      iconColor: primaryColor(300),
    };
  }, [primaryColor, neutralColor]);
  return {
    classes,
  };
};
export { useStyle };
