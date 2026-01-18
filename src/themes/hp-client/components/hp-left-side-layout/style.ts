import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";

const useStyle = ({
  navStatus,
  customGap,
}: {
  navStatus: any;
  customGap?: number;
}) => {
  const { primaryColor, primarySecondaryBlend, theme } = useGomakeTheme();
  const { t } = useTranslation();
  const isRTL = t("direction") === "rtl";

  const classes = useMemo(() => {
    return {
      // Sidebar Container
      sidebar: {
        boxSizing: "border-box" as const,
        position: "relative" as "relative",
        zIndex: 1,
        width: navStatus?.isClosed ? "60px" : "270px",
        height: "100vh",
        left: "0px",
        top: "0px",
        background: "#FFFFFF",
        ...(isRTL
          ? { borderLeft: "1px solid #E0E0E0" }
          : { borderRight: "1px solid #E0E0E0" }),
        borderRadius: "0px",
        transition: "width 0.3s ease",
        overflowY: "hidden" as const,
        overflowX: "visible" as const, // Allow horizontal overflow to show full text
        display: "flex",
        flexDirection: "column" as const,
      },

      // Header Section
      header: {
        flexShrink: 0,
        width: "100%",
        minHeight: "64px",
        padding: navStatus?.isClosed ? "0px" : "16px 0px",
        ...(isRTL
          ? {
              paddingRight: navStatus?.isClosed ? "0px" : "8px",
              paddingLeft: navStatus?.isClosed ? "0px" : "8px",
            }
          : {
              paddingLeft: navStatus?.isClosed ? "0px" : "8px",
              paddingRight: navStatus?.isClosed ? "0px" : "8px",
            }),
        display: "flex",
        alignItems: "center",
        justifyContent: navStatus?.isClosed ? "center" : isRTL ? "flex-end" : "flex-start",
        transition: "all 0.3s ease",
      },

      headerContent: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: navStatus?.isClosed ? "center" : isRTL ? "flex-end" : "flex-start",
        padding: navStatus?.isClosed ? "0px" : "0px 8px 12px",
        gap: navStatus?.isClosed ? "0px" : "12px",
        width: "100%",
        justifyContent: navStatus?.isClosed ? "center" : isRTL ? "flex-end" : "flex-start",
        position: "relative" as const,
      },

      logoCircle: {
        display: "flex",
        flexDirection: "row" as const,
        justifyContent: "center",
        alignItems: "center",
        padding: "0px",
        position: navStatus?.isClosed
          ? ("relative" as const)
          : ("absolute" as const),
        width: navStatus?.isClosed ? "42px" : "42px",
        height: navStatus?.isClosed ? "42px" : "42px",
        ...(navStatus?.isClosed
          ? { left: "auto", right: "auto" }
          : isRTL
          ? { right: "0px", left: "auto" }
          : { left: "0px", right: "auto" }),
        top: navStatus?.isClosed ? "auto" : "0px",
        margin: navStatus?.isClosed ? "16px auto" : "0px",
        background: navStatus?.isClosed
          ? "rgba(2, 74, 216, 0.1)"
          : "transparent",
        borderRadius: navStatus?.isClosed ? "1000px" : "0px",
        transition: "all 0.3s ease",
      },

      headerText: {
        position: "absolute" as const,
        ...(isRTL ? { right: "52px", left: "auto" } : { left: "52px", right: "auto" }),
        top: "0px",
      },

      companyName: {
        width: "115px",
        height: "24px",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontStyle: "normal" as const,
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "24px",
        display: "flex",
        alignItems: "center",
        color: "#000000",
      },

      poweredBy: {
        width: "135px",
        height: "17px",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontStyle: "normal" as const,
        fontWeight: 400,
        fontSize: "12.0719px",
        lineHeight: "16px",
        display: "flex",
        alignItems: "center",
        color: "#000000",
        marginTop: "3px",
      },

      // Navigation Section
      navigation: {
        flex: 1,
        minHeight: 0, // Important for flexbox scrolling
        width: "100%",
        overflowY: "auto" as const,
        overflowX: "visible" as const, // Allow horizontal overflow to show full text
        borderRadius: "0px",
        transition: "all 0.3s ease",
        marginTop: navStatus?.isClosed ? "0px" : "18px", // Space between header and navigation only when open
      },

      menuContainer: {
        padding: navStatus?.isClosed ? "0px 8px 16px" : "0px 8px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "4px",
        alignItems: navStatus?.isClosed ? "center" : "flex-start", // Center when closed, left when open
        transition: "all 0.3s ease",
        minHeight: "100%", // Ensure container takes full height for scrolling
        paddingBottom: navStatus?.isClosed ? "16px" : "32px", // Less padding when closed, more when open for scrolling
      },

      // Collapse Button
      collapseButton: {
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        padding: "4px",
        gap: "8px",
        position: "absolute" as const,
        width: "28px",
        height: "28px",
        left: navStatus?.isClosed ? "26px" : "208px",
        top: "863px",
        border: "1px solid var(--theme-primary-color, #024AD8)",
        borderRadius: "32px",
        cursor: "pointer",
        transition: "left 0.3s ease",
      },

      collapseButtonInner: {
        width: "20px",
        height: "20px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      },

      collapseIcon: {
        width: "20px",
        height: "20px",
        background: "var(--theme-primary-color, #024AD8)",
        // Icon will be replaced with actual SVG/component
      },
    };
  }, [navStatus, primaryColor, primarySecondaryBlend, isRTL, theme]);

  return {
    classes,
    primaryColor,
  };
};

// Global styles for navigation scrollbar
export const NavigationScrollbarStyles = createGlobalStyle`
  .hp-navigation-scroll {
    /* Firefox scrollbar - hide by default, show on hover */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }

  .hp-navigation-scroll:hover {
    scrollbar-color: #CCCDCF transparent;
  }

  /* Webkit scrollbar (Chrome, Safari, Edge) */
  .hp-navigation-scroll::-webkit-scrollbar {
    width: 6px;
    display: none; /* Hide by default */
  }

  .hp-navigation-scroll:hover::-webkit-scrollbar {
    display: block; /* Show on hover */
  }

  .hp-navigation-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .hp-navigation-scroll::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  .hp-navigation-scroll:hover::-webkit-scrollbar-thumb {
    background: #CCCDCF;
  }

  .hp-navigation-scroll::-webkit-scrollbar-thumb:hover {
    background: #A0A0A0;
  }

  /* Hide scrollbar arrows/buttons */
  .hp-navigation-scroll::-webkit-scrollbar-button {
    display: none;
  }
`;

export { useStyle };
