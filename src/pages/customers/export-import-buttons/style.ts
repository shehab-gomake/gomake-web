import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
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
        ...FONT_FAMILY.Lexend(500, 13),
        color: "rgba(130, 131, 190, 1)",
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
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
