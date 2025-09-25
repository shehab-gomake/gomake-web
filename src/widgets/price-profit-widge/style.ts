import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "#FFFF",
        height: "100%",
        borderRadius: 16,
      },
      divider: {
        width: "100%",
        borderColor: "#E0E0E0",
      },
      headerSection: {
        width: "100%",
        flexShrink: 0,
      },
      contentSection: {
        width: "100%",
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column" as "column",
        gap: "16px",
        padding: "16px 0",
      },
      chartContainer: {
        width: "100%",
        marginBottom: "20px",
      },
      modalStyle: {
        width: "50%",
        borderRadius: "8px",
        height: "auto",
        maxHeight: 600,
        gap: "10px",
      },
      totalsContainer: {
        display: "flex",
        gap: "8px",
        flexDirection: "row" as "row",
        flexWrap: "nowrap" as "nowrap",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0px 16px",
        marginTop: "8px",
      },
      totalCard: {
        display: "flex",
        flexDirection: "row" as "row",
        gap: "8px",
        alignItems: "center",
        padding: "3px 6px",
        backgroundColor: "#2E3092",
        borderRadius: "4px",
        minWidth: "50px",
        height: "28px",
        justifyContent: "center",
      },
      totalLabel: {
        color: "#FFFFFF",
        marginBottom: "1px",
        ...FONT_FAMILY.Inter(500, 14),
      },
      totalValue: {
        color: "#FFFFFF",
        ...FONT_FAMILY.Lexend(600, 12),
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
