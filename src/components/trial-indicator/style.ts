import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        alignItems: "center",
        marginRight: "16px",
      },
      indicator: {
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        borderRadius: "24px",
        border: "2px solid",
        fontSize: "13px",
        fontWeight: "600",
        gap: "8px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      },
      icon: {
        fontSize: "18px",
        width: "18px",
        height: "18px",
        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
      },
      text: {
        whiteSpace: "nowrap" as const,
        letterSpacing: "0.3px",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
