import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      },
      header: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
      },
      title: {
        ...FONT_FAMILY.Inter(500, 14),
        color: "#FFF",
        flex: 1,
        marginRight: 8,
      },
      statusContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        gap: 4,
      },
      statusIcon: {
        fontSize: 12,
      },
      statusText: {
        ...FONT_FAMILY.Inter(400, 12),
        textTransform: "capitalize" as "capitalize",
      },
      description: {
        ...FONT_FAMILY.Inter(400, 12),
        color: "rgba(255, 255, 255, 0.7)",
        lineHeight: "16px",
        marginBottom: 8,
      },
      footer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-end",
      },
      date: {
        ...FONT_FAMILY.Inter(400, 11),
        color: "rgba(255, 255, 255, 0.5)",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
