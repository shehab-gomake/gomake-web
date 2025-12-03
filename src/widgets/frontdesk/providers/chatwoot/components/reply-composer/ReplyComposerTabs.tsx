/**
 * Reply Composer Tabs Component
 *
 * Segmented control for switching between "Reply" and "Private Note" modes.
 * Follows Chatwoot's design patterns.
 */

import React from "react";
import { Box, ButtonBase } from "@mui/material";
import { colorTokens, radiusTokens, shadowTokens } from "@/widgets/frontdesk/design-system";

export type ReplyTabValue = "reply" | "private";

export interface ReplyComposerTabsProps {
  /** Currently active tab */
  activeTab: ReplyTabValue;
  /** Callback when tab changes */
  onTabChange: (tab: ReplyTabValue) => void;
  /** Border color */
  borderColor?: string;
  /** Text color */
  textColor?: string;
  /** Light gray text color */
  lightGrayText?: string;
  /** Neutral color function */
  neutralColor?: (shade: number) => string;
}

export const ReplyComposerTabs: React.FC<ReplyComposerTabsProps> = ({
  activeTab,
  onTabChange,
  borderColor = "#E5E7EB",
  textColor = "#111827",
  lightGrayText = "#6B7280",
  neutralColor = (shade: number) => {
    const colors: Record<number, string> = {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
    };
    return colors[shade] || colors[200];
  },
}) => {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          borderRadius: 1,
          backgroundColor: colorTokens.neutral[100],
          border: `1px solid ${colorTokens.neutral[200]}`,
          overflow: "hidden",
          gap: 0,
        }}
      >
        <ButtonBase
          onClick={() => onTabChange("reply")}
          sx={{
            px: 2,
            py: 0.75,
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            color: activeTab === "reply" ? textColor : lightGrayText,
            backgroundColor: activeTab === "reply" ? "white" : "transparent",
            borderRadius: activeTab === "reply" ? "8px 0 0 8px" : 0,
            borderRight: `1px solid ${colorTokens.neutral[200]}`,
            boxShadow: activeTab === "reply" ? `0 1px 2px ${colorTokens.neutral[200]}` : "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: activeTab === "reply" ? "white" : colorTokens.neutral[50],
            },
          }}
        >
          Reply
        </ButtonBase>
        <ButtonBase
          onClick={() => onTabChange("private")}
          sx={{
            px: 2,
            py: 0.75,
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            color: activeTab === "private" ? textColor : lightGrayText,
            backgroundColor: activeTab === "private" ? "white" : "transparent",
            borderRadius: activeTab === "private" ? "0 8px 8px 0" : 0,
            boxShadow: activeTab === "private" ? `0 1px 2px ${colorTokens.neutral[200]}` : "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: activeTab === "private" ? "white" : colorTokens.neutral[50],
            },
          }}
        >
          Private Note
        </ButtonBase>
      </Box>
    </Box>
  );
};
