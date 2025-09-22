import { alpha } from "@mui/material";

/**
 * Common styling utilities for email components
 */

/**
 * Creates consistent badge styling for unread counts
 */
export const getUnreadBadgeStyles = () => ({
  "& .MuiBadge-badge": {
    fontSize: "0.65rem",
    height: 16,
    minWidth: 16,
  },
});

/**
 * Creates consistent list item button styles
 */
export const getListItemButtonStyles = (primaryColor: (shade: number) => string, neutralColor: (shade: number) => string) => ({
  borderRadius: 1,
  mx: 0.5,
  py: 0.75,
  "&.Mui-selected": {
    backgroundColor: alpha(primaryColor(100), 0.8),
    borderLeft: `3px solid ${primaryColor(500)}`,
    "&:hover": {
      backgroundColor: alpha(primaryColor(100), 0.9),
    },
  },
  "&:hover": {
    backgroundColor: alpha(neutralColor(100), 0.5),
  },
});

/**
 * Creates consistent conversation list item styles
 */
export const getConversationListItemStyles = (
  primaryColor: (shade: number) => string,
  neutralColor: (shade: number) => string
) => ({
  borderRadius: 1,
  mb: 0.5,
  mx: 1,
  "&.Mui-selected": {
    backgroundColor: alpha(primaryColor(100), 0.8),
    borderLeft: `3px solid ${primaryColor(500)}`,
    "&:hover": {
      backgroundColor: alpha(primaryColor(100), 0.9),
    },
  },
  "&:hover": {
    backgroundColor: alpha(neutralColor(100), 0.5),
  },
});

/**
 * Creates consistent avatar styles
 */
export const getAvatarStyles = (size: number = 32) => ({
  width: size,
  height: size,
  fontSize: size <= 24 ? "0.6rem" : "0.75rem",
  fontWeight: 600,
});

/**
 * Creates consistent typography styles for email content
 */
export const getEmailTypographyStyles = (primaryColor: (shade: number) => string, neutralColor: (shade: number) => string) => ({
  subject: {
    fontWeight: 600,
    color: neutralColor(900),
    fontSize: "1rem",
  },
  participant: {
    fontWeight: 500,
    color: neutralColor(800),
    fontSize: "0.875rem",
  },
  snippet: {
    color: neutralColor(500),
    fontSize: "0.8rem",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: 1.3,
  },
  timestamp: {
    color: neutralColor(500),
    fontSize: "0.7rem",
  },
});
