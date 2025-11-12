import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryLavender, primaryColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      secondText: {
        color: primaryColor(200),
        ...FONT_FAMILY.Lexend(400, 12),
      },
      UpdateCurrencyView: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        gap: 10,
      },
      priceCheckedContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: -8,
        marginBottom: 0,
      },
      insideStyle: { width: "85%" },
      menuItemContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
        paddingLeft: 15,
      },
      iconColor: primaryColor(300),
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
        ...FONT_FAMILY.Lexend(500, 14),
        color: primaryLavender(500),
      },
      actionIconStyle: {
        width: 20,
        height: 20,
        objectFit: "cover" as "cover",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      AddNewRuleDiv: {
        marginTop: "2%",
        marginBottom: "2%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      },
      spanAddNewRule: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: primaryColor(500),
        fontSize: 15,
        marginLeft: 10,
      },
      textInputStyle: {
        border: "0px",
        background: "#fff",
        borderRadius: 4,
        height: 40,
      },
      iconButton: {
        backgroundColor: "#f5f5f5",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "8px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: `var(--theme-secondary-color, ${primaryColor(500)})`,
          border: "none",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(46, 48, 146, 0.15)",
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
        },
        "&:active": {
          transform: "translateY(0px)",
          boxShadow: "0 2px 6px rgba(46, 48, 146, 0.2)",
        },
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
