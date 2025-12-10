/**
 * Reply Composer Tabs Component
 *
 * Premium pill-style segmented control for switching between "Reply" and "Private Note" modes.
 * Modern design with smooth transitions and clear visual feedback.
 */

import React from "react";
import { Box, ButtonBase, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
}

export const ReplyComposerTabs: React.FC<ReplyComposerTabsProps> = ({
  activeTab,
  onTabChange,
  textColor = colorTokens.neutral[900],
  lightGrayText = colorTokens.neutral[500],
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        direction: dir,
      }}
    >
      {/* Pill-style container */}
      <Box
        sx={{
          display: "inline-flex",
          borderRadius: `${radiusTokens.full}px`,
          backgroundColor: colorTokens.neutral[200],
          padding: "3px",
          gap: "2px",
        }}
      >
        {/* Reply Tab */}
        <ButtonBase
          onClick={() => onTabChange("reply")}
          sx={{
            px: 2.5,
            py: 0.875,
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "none",
            color:
              activeTab === "reply"
                ? colorTokens.neutral[900]
                : colorTokens.neutral[500],
            backgroundColor:
              activeTab === "reply"
                ? colorTokens.semantic.background.primary
                : "transparent",
            borderRadius: `${radiusTokens.full}px`,
            boxShadow: activeTab === "reply" ? shadowTokens.sm : "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            flexDirection: isRTL ? "row-reverse" : "row",
            gap: 1,
            "&:hover": {
              backgroundColor:
                activeTab === "reply"
                  ? colorTokens.semantic.background.primary
                  : colorTokens.neutral[100],
            },
          }}
        >
          <SendOutlinedIcon sx={{ fontSize: 16, strokeWidth: 1.5 }} />
          {t("frontdesk.compose.reply")}
        </ButtonBase>

        {/* Private Note Tab */}
        <ButtonBase
          onClick={() => onTabChange("private")}
          sx={{
            px: 2.5,
            py: 0.875,
            fontSize: "0.8125rem",
            fontWeight: 600,
            textTransform: "none",
            color:
              activeTab === "private"
                ? colorTokens.warning[700]
                : colorTokens.neutral[500],
            backgroundColor:
              activeTab === "private" ? colorTokens.warning[50] : "transparent",
            borderRadius: `${radiusTokens.full}px`,
            boxShadow: activeTab === "private" ? shadowTokens.sm : "none",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            alignItems: "center",
            flexDirection: isRTL ? "row-reverse" : "row",
            gap: 1,
            "&:hover": {
              backgroundColor:
                activeTab === "private"
                  ? colorTokens.warning[50]
                  : colorTokens.neutral[100],
            },
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 16, strokeWidth: 1.5 }} />
          {t("frontdesk.compose.privateNote")}
        </ButtonBase>
      </Box>
    </Box>
  );
};
