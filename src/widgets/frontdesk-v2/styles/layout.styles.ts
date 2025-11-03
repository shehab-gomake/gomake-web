/**
 * FrontDesk V2 - Layout Styled Components
 * Reusable styled components for the three-column layout system
 */

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { frontdeskV2Theme } from "./theme";

/**
 * Main layout container - flex container for all panels
 */
export const LayoutContainer = styled(Box)(() => ({
  display: "flex",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  backgroundColor: frontdeskV2Theme.colors.background.primary,
  position: "relative",
}));

/**
 * Base panel styles - shared by all sidebars/panels
 */
const basePanelStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  overflow: "hidden",
  transition: frontdeskV2Theme.transitions.default,
};

/**
 * Left Sidebar - Navigation panel (240px)
 */
export const LeftSidebarContainer = styled(Box)(() => ({
  ...basePanelStyles,
  width: `${frontdeskV2Theme.layout.leftSidebarWidth}px`,
  minWidth: `${frontdeskV2Theme.layout.leftSidebarWidth}px`,
  backgroundColor: frontdeskV2Theme.colors.background.tertiary,
}));

/**
 * Middle Panel - Conversation list (380px)
 */
export const MiddlePanelContainer = styled(Box)(() => ({
  ...basePanelStyles,
  width: `${frontdeskV2Theme.layout.middlePanelWidth}px`,
  minWidth: `${frontdeskV2Theme.layout.middlePanelWidth}px`,
  backgroundColor: frontdeskV2Theme.colors.background.secondary,
  borderRight: `1px solid ${frontdeskV2Theme.colors.border.default}`,
}));

/**
 * Center Panel - Message thread (flex-1)
 */
export const CenterPanelContainer = styled(Box)(() => ({
  ...basePanelStyles,
  flex: 1,
  backgroundColor: frontdeskV2Theme.colors.background.primary,
  borderRight: `1px solid ${frontdeskV2Theme.colors.border.default}`,
  minWidth: 0, // Important for flex items to shrink below content size
}));

/**
 * Right Sidebar - Contact details (340px)
 */
export const RightSidebarContainer = styled(Box)(() => ({
  ...basePanelStyles,
  width: `${frontdeskV2Theme.layout.rightSidebarWidth}px`,
  minWidth: `${frontdeskV2Theme.layout.rightSidebarWidth}px`,
  backgroundColor: frontdeskV2Theme.colors.background.secondary,
}));

/**
 * Reusable panel component with configurable width
 * Use this for custom panel widths if needed
 */
export interface PanelProps {
  width?: number;
  backgroundColor?: string;
  borderRight?: boolean;
}

export const Panel = styled(Box)<PanelProps>(
  ({ width, backgroundColor, borderRight }) => ({
    ...basePanelStyles,
    ...(width && {
      width: `${width}px`,
      minWidth: `${width}px`,
    }),
    ...(backgroundColor && {
      backgroundColor,
    }),
    ...(borderRight && {
      borderRight: `1px solid ${frontdeskV2Theme.colors.border.default}`,
    }),
  })
);

