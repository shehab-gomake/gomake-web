import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      // HP Client header container - matches Figma design
      headerContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 24px",
        width: "100%",
        height: "56px",
        background: "#FFFFFF",
        borderBottom: "1px solid #E0E0E0",
        borderRadius: 0,
      },
      // Left side container with trial indicator
      leftContainer: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        width: "100%",
      },
      // Icon button style - circular gray background
      iconButton: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        width: "32px",
        height: "32px",
        background: "#E0E0E0",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
      },
      // Support icon button with badge
      supportIconButton: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
        width: "32px",
        height: "32px",
        background: "#E0E0E0",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
      },
      // Badge style for notifications
      notificationBadge: {
        fontSize: "0.7rem",
        height: 18,
        minWidth: 18,
        right: 4,
        top: 4,
        backgroundColor: "#CC2C00",
      },
    };
  }, []);

  return {
    classes,
  };
};

export { useStyle };
