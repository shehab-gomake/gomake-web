import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";
import { adaptRight } from "@/utils/adapter";
import styled from "styled-components";
import Link from "next/link";

const StyledMenuItem = styled.div<{
  $isSelected: boolean;
  $isListOpen?: boolean;
  $isClosed: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.$isClosed ? "center" : "flex-start")};
  padding: 0px 8px;
  gap: 0px;
  isolation: isolate;
  width: ${(props) => (props.$isClosed ? "43px" : "183px")};
  height: 40px;
  background: ${(props) =>
    props.$isSelected
      ? "var(--theme-primary-200, #B2D2FF)"
      : props.$isListOpen
      ? "var(--theme-primary-200-alpha, rgba(178, 210, 255, 0.3))"
      : "transparent"};
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$isSelected
        ? "var(--theme-primary-200, #B2D2FF)"
        : "var(--theme-primary-200-alpha, rgba(178, 210, 255, 0.3))"};
  }
`;

// Styled Sub Menu Item with hover support
const StyledSubMenuItem = styled(Link)<{ $isRTL: boolean; $isClosed: boolean }>`
  padding-top: 8px;
  padding-bottom: 8px;
  text-decoration: none;
  display: ${(props) => (props.$isClosed ? "none" : "flex")};
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease,
    ${(props) => (props.$isRTL ? "padding-right" : "padding-left")} 0.3s ease;
  ${(props) =>
    props.$isRTL
      ? `
        padding-right: ${props.$isClosed ? "0px" : "24px"};
        padding-left: 8px;
      `
      : `
        padding-left: ${props.$isClosed ? "0px" : "24px"};
        padding-right: 8px;
      `}

  &:hover {
    opacity: 0.7;
  }
`;

const useStyle = ({
  isSelected,
  navStatus,
  customGap,
}: {
  isSelected: boolean;
  navStatus: any;
  customGap?: number;
}) => {
  const { primaryColor, primarySecondaryBlend } = useGomakeTheme();
  const { t } = useTranslation();
  const isRTL = t("direction") === "rtl";

  const classes = useMemo(() => {
    return {
      // Menu Item Container - now using StyledMenuItem component
      menuItem: {
        // This will be replaced by StyledMenuItem
      },

      menuItemLink: {
        textDecoration: "none",
        display: "block",
        marginBottom: "0px",
      },

      menuItemContent: {
        display: "flex",
        flexDirection: "row" as const,
        alignItems: "center",
        justifyContent: navStatus?.isClosed ? "center" : "flex-start",
        gap: navStatus?.isClosed ? "0px" : "8px",
        width: "100%",
        zIndex: 1,
      },

      iconContainer: {
        width: "24px",
        height: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 0,
        // Always show icon, even when sidebar is closed
      },

      // Label Text
      label: {
        width: "auto",
        height: "20px",
        fontFamily: "'Forma DJR UI', sans-serif",
        fontStyle: "normal" as const,
        fontWeight: 400,
        fontSize: "15px",
        lineHeight: "20px",
        display: "flex",
        alignItems: "center",
        color: isSelected ? "#001CB0" : "#1A1A1A", // Dark blue when selected, black otherwise
        flex: 1,
        zIndex: 1,
      },

      // Highlight Bar (left/right side indicator for selected item)
      highlight: {
        position: "absolute" as const,
        width: "6px", // Total width including border (2px border on each side + 2px inner)
        height: "18px",
        ...adaptRight(t("direction"), -1),
        top: "50%", // Center vertically
        transform: "translateY(-50%)", // Center vertically
        background: "#FFFFFF",
        borderRadius: "4px",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      highlightInner: {
        width: "2px",
        height: "12px", // Smaller height for inner blue element
        background: "#001CB0",
        borderRadius: "2px",
      },

      // Sub Menu Items
      subMenuItem: {
        paddingTop: "8px",
        paddingBottom: "8px",
        ...(isRTL
          ? {
              paddingRight: navStatus?.isClosed ? "0px" : "16px", // Indent children to the left in RTL
              paddingLeft: "8px",
            }
          : {
              paddingLeft: navStatus?.isClosed ? "0px" : "16px", // Indent children to the right in LTR
              paddingRight: "8px",
            }),
        textDecoration: "none",
        display: navStatus?.isClosed ? "none" : "flex", // Hide submenu items when closed
        transition: isRTL
          ? "padding-right 0.3s ease, opacity 0.2s ease"
          : "padding-left 0.3s ease, opacity 0.2s ease",
        cursor: "pointer",
        opacity: 1,
      },

      subMenuLabel: {
        ...FONT_FAMILY.Inter(400, 14),
        color: "#1A1A1A",
        cursor: "pointer",
        transition: "opacity 0.2s ease",
      },
    };
  }, [isSelected, navStatus, primaryColor, primarySecondaryBlend, isRTL]);

  return {
    classes,
    StyledMenuItem,
    StyledSubMenuItem,
  };
};

export { useStyle, StyledMenuItem, StyledSubMenuItem };
