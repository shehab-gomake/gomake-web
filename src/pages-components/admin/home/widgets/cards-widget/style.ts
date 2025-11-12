import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        padding: "var(--theme-spacing-lg, 20px)",
        backgroundColor: "var(--theme-bg-primary, #FFFFFF)",
        borderRadius: "var(--theme-radius-md, 8px)",
        boxShadow:
          "var(--theme-shadow-md, 0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08))",
        gap: "var(--theme-spacing-md, 15px)",
      },
      firstDiv: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        width: "50%",
        gap: "var(--theme-spacing-sm, 10px)",
      },
      secondDiv: {
        display: "flex",
        flexDirection: "column" as "column",
        height: "100%",
        width: "50%",
        gap: "var(--theme-spacing-sm, 10px)",
      },
      firstCard: {
        display: "flex",
        width: "100%",
        height: "50%",
        alignItems: "center",
      },
      secondCard: {
        display: "flex",
        width: "100%",
        height: "25%",
        alignItems: "center",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
