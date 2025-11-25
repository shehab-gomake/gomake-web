import React from "react";
import { Menu, MenuProps, Box, Typography, Divider } from "@mui/material";
import { colorTokens, shadowTokens, spacingTokens } from "@/widgets/frontdesk/design-system";

/**
 * A styled subheader for use within DropdownMenu to create sections.
 */
export const MenuSubheader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box px={`${spacingTokens[3]}px`} pt={`${spacingTokens[2]}px`} pb={`${spacingTokens[1]}px`}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
      {children}
    </Typography>
  </Box>
);

interface DropdownMenuProps extends Omit<MenuProps, "open"> {
  open: boolean;
  onClose: () => void;
  title?: string;
  actions?: React.ReactNode;
  width?: number;
  /**
   * Disables the default padding around the content.
   * Use this when the children are MUI MenuItems, which have their own padding.
   */
  disableContentPadding?: boolean;
}

/**
 * A standardized, reusable dropdown menu component that conforms to the FrontDesk design system.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open,
  onClose,
  title,
  actions,
  children,
  width = 280,
  disableContentPadding = false,
  ...props
}) => {
  const content = disableContentPadding ? (
    children
  ) : (
    <Box sx={{ px: `${spacingTokens[3]}px`, py: `${spacingTokens[2]}px` }}>{children}</Box>
  );

  // Only set default anchorOrigin/transformOrigin if not using anchorPosition
  const isUsingAnchorPosition = props.anchorReference === 'anchorPosition';
  
  const defaultMenuProps = isUsingAnchorPosition
    ? {}
    : {
        anchorOrigin: {
          vertical: "bottom" as const,
          horizontal: "right" as const,
        },
        transformOrigin: {
          vertical: "top" as const,
          horizontal: "right" as const,
        },
      };

  return (
    <Menu
      {...defaultMenuProps}
      open={open}
      onClose={onClose}
      disableScrollLock
      TransitionProps={{
        timeout: 250,
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            width: width,
            mt: isUsingAnchorPosition ? 0 : 1,
            borderRadius: "8px",
            boxShadow: shadowTokens.xl,
            border: `0.5px solid ${colorTokens.semantic.border.default}`,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            // Fix distortion: disable transform animations
            transform: "none !important",
            transformOrigin: "top right",
            willChange: "opacity",
            // Ensure smooth rendering
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
            overflow: 'hidden',
            ...props.slotProps?.paper?.sx,
          },
        },
      }}
      {...props}
    >
      {title && (
        <Box px={`${spacingTokens[3]}px`} py={`${spacingTokens[2]}px`}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase" }}>
            {title}
          </Typography>
        </Box>
      )}
      {content}
      {actions && (
        <>
          <Divider sx={{ my: `${spacingTokens[1]}px` }} />
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 1, px: `${spacingTokens[3]}px`, pb: `${spacingTokens[2]}px` }}
          >
            {actions}
          </Box>
        </>
      )}
    </Menu>
  );
};
