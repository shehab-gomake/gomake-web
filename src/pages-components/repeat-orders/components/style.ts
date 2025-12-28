import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      cardContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        overflow: "hidden" as "hidden",
        height: "100%",
        transition: "all 0.3s ease",
        border: "1px solid #E5E7EB",
        "&:hover": {
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-2px)",
          borderColor: primaryColor(200),
        },
      },
      imageContainer: {
        width: "100%",
        height: "220px",
        overflow: "hidden" as "hidden",
        backgroundColor: "#FAFAFA",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #E5E7EB",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#F5F5F5",
        },
      },
      cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "contain" as "contain",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
      },
      cardContent: {
        padding: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column" as "column",
        minHeight: 0,
      },
      contentStack: {
        height: "100%",
        display: "flex",
        flexDirection: "column" as "column",
      },
      mainFieldContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "6px",
        paddingBottom: "12px",
        borderBottom: "1px solid #E5E5E5",
        marginBottom: "4px",
      },
      fieldContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        gap: "4px",
      },
      fieldLabel: {
        ...FONT_FAMILY.Lexend(500, 11),
        color: "#8E8E93",
        letterSpacing: "0.3px",
        textTransform: "uppercase" as "uppercase",
        marginBottom: "2px",
      },
      fieldValue: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: "#1A1A1A",
        lineHeight: "1.4",
        wordBreak: "break-word" as "break-word",
      },
      statusValue: {
        ...FONT_FAMILY.Lexend(600, 13),
        color: primaryColor(600),
        lineHeight: "1.4",
        wordBreak: "break-word" as "break-word",
      },
      datesSection: {
        paddingTop: "8px",
        marginTop: "8px",
        borderTop: "1px solid #F0F0F0",
      },
      dateField: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between" as "space-between",
        alignItems: "center",
        gap: "8px",
      },
      dateLabel: {
        ...FONT_FAMILY.Lexend(500, 11),
        color: "#8E8E93",
        letterSpacing: "0.3px",
        textTransform: "uppercase" as "uppercase",
        flexShrink: 0,
      },
      dateValue: {
        ...FONT_FAMILY.Lexend(500, 12),
        color: "#5E5E5E",
        textAlign: "right" as "right",
      },
      quantityContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        backgroundColor: "#F8F9FA",
        borderRadius: "6px",
        marginTop: "auto",
        border: "1px solid #E5E7EB",
      },
      quantityLabel: {
        ...FONT_FAMILY.Lexend(600, 13),
        color: "#1A1A1A",
      },
      quantityButton: {
        backgroundColor: secondColor(500),
        color: "#FFFFFF",
        width: "28px",
        height: "28px",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          backgroundColor: secondColor(600),
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
        },
        "&:disabled": {
          backgroundColor: "#D1D5DB",
          color: "#9CA3AF",
          boxShadow: "none",
        },
        transition: "all 0.2s ease",
        "& .MuiSvgIcon-root": {
          fontSize: "16px",
        },
      },
      quantityValue: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: "#1A1A1A",
        minWidth: "40px",
        textAlign: "center" as "center",
        padding: "0 6px",
      },
      repeatButton: {
        width: "100%",
        marginTop: "8px",
        height: "44px",
        ...FONT_FAMILY.Lexend(600, 15),
        textTransform: "none" as "none",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
        },
      },
      imageViewerOverlay: {
        position: "fixed" as "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      },
      imageViewerContent: {
        position: "relative" as "relative",
        maxWidth: "90%",
        maxHeight: "90%",
        cursor: "default",
      },
      imageViewerImage: {
        maxWidth: "100%",
        maxHeight: "90vh",
        objectFit: "contain" as "contain",
      },
      imageViewerClose: {
        position: "absolute" as "absolute",
        top: "-40px",
        right: "-40px",
        color: "#FFFFFF",
        fontSize: "40px",
        width: "40px",
        height: "40px",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    };
  }, [theme, primaryColor, secondColor]);

  return {
    classes,
  };
};

export { useStyle };
