/**
 * Reply Composer Email Fields Component
 *
 * Premium email recipient fields (TO, CC, BCC) with cleaner dropdown toggle.
 * Features modern styling with subtle backgrounds and smooth transitions.
 */

import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Chip,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  colorTokens,
  radiusTokens,
  shadowTokens,
  semanticSpacing,
} from "@/widgets/frontdesk/design-system";

export interface ReplyComposerEmailFieldsProps {
  /** TO email addresses */
  toEmails: string;
  /** CC email addresses */
  ccEmails: string;
  /** BCC email addresses */
  bccEmails: string;
  /** Whether to show CC field */
  showCc: boolean;
  /** Whether to show BCC field */
  showBcc: boolean;
  /** Callback when CC changes */
  onCcChange: (value: string) => void;
  /** Callback when BCC changes */
  onBccChange: (value: string) => void;
  /** Callback when CC visibility toggles */
  onToggleCc: () => void;
  /** Callback when BCC visibility toggles */
  onToggleBcc: () => void;
  /** Border color */
  borderColor?: string;
  /** Text color */
  textColor?: string;
  /** Light gray text color */
  lightGrayText?: string;
}

export const ReplyComposerEmailFields: React.FC<
  ReplyComposerEmailFieldsProps
> = ({
  toEmails,
  ccEmails,
  bccEmails,
  showCc,
  showBcc,
  onCcChange,
  onBccChange,
  onToggleCc,
  onToggleBcc,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddCc = () => {
    onToggleCc();
    handleMenuClose();
  };

  const handleAddBcc = () => {
    onToggleBcc();
    handleMenuClose();
  };

  const handleCloseCc = () => {
    onCcChange("");
    onToggleCc();
  };

  const handleCloseBcc = () => {
    onBccChange("");
    onToggleBcc();
  };

  // Field styling
  const fieldContainerStyle = {
    backgroundColor: colorTokens.semantic.background.primary,
    borderRadius: `${radiusTokens.md}px`,
    px: 1.5,
    py: 0.75,
    transition: "all 0.15s ease",
    "&:focus-within": {
      backgroundColor: colorTokens.semantic.background.primary,
      boxShadow: `0 0 0 2px ${colorTokens.primary[100]}`,
    },
  };

  const fieldInputStyle = {
    "& .MuiInput-root": {
      backgroundColor: "transparent",
      color: colorTokens.neutral[900],
      fontSize: "0.875rem",
    },
    "& .MuiInputBase-input": {
      py: 0.25,
      px: 0,
      "&::placeholder": {
        color: colorTokens.neutral[400],
        opacity: 1,
      },
    },
  };

  const labelStyle = {
    color: colorTokens.neutral[500],
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    minWidth: 32,
  };

  // Check if we can show the add button
  const canAddMoreRecipients = !showCc || !showBcc;

  return (
    <Stack
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: "transparent",
        gap: 1,
        // direction: dir,
      }}
    >
      {/* TO Field - Clean chip display with add button */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          gap: 1.5,
        }}
      >
        <Typography sx={labelStyle}>{t("frontdesk.compose.to")}</Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {toEmails ? (
            <Chip
              label={toEmails}
              size="small"
              sx={{
                height: 28,
                fontSize: "0.8125rem",
                fontWeight: 500,
                backgroundColor: colorTokens.primary[50],
                color: colorTokens.primary[700],
                border: `1px solid ${colorTokens.primary[200]}`,
                borderRadius: `${radiusTokens.md}px`,
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          ) : (
            <Typography
              sx={{
                color: colorTokens.neutral[400],
                fontSize: "0.875rem",
                fontStyle: "italic",
              }}
            >
              {t("frontdesk.compose.noRecipient")}
            </Typography>
          )}
        </Box>

        {/* Add CC/BCC Dropdown Button */}
        {canAddMoreRecipients && (
          <>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: colorTokens.neutral[400],
                p: 0.75,
                borderRadius: `${radiusTokens.md}px`,
                border: `1px dashed ${colorTokens.neutral[300]}`,
                transition: "all 0.15s ease",
                "&:hover": {
                  backgroundColor: colorTokens.neutral[100],
                  borderColor: colorTokens.neutral[400],
                  color: colorTokens.neutral[600],
                },
              }}
              aria-label="Add CC or BCC"
            >
              <AddOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  minWidth: 160,
                  borderRadius: `${radiusTokens.lg}px`,
                  boxShadow: shadowTokens.lg,
                  border: `1px solid ${colorTokens.neutral[200]}`,
                },
              }}
            >
              {!showCc && (
                <MenuItem
                  onClick={handleAddCc}
                  sx={{
                    py: 1,
                    px: 2,
                    "&:hover": {
                      backgroundColor: colorTokens.neutral[50],
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonAddOutlinedIcon
                      sx={{ fontSize: 18, color: colorTokens.neutral[600] }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("frontdesk.compose.addCc")}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  />
                </MenuItem>
              )}
              {!showBcc && (
                <MenuItem
                  onClick={handleAddBcc}
                  sx={{
                    py: 1,
                    px: 2,
                    "&:hover": {
                      backgroundColor: colorTokens.neutral[50],
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <VisibilityOffOutlinedIcon
                      sx={{ fontSize: 18, color: colorTokens.neutral[600] }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={t("frontdesk.compose.addBcc")}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  />
                </MenuItem>
              )}
            </Menu>
          </>
        )}
      </Stack>

      {/* CC Field (conditional) */}
      <Collapse in={showCc} timeout={200}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            gap: 1.5,
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <Typography sx={labelStyle}>{t("frontdesk.compose.cc")}</Typography>
          <Box sx={{ flex: 1, ...fieldContainerStyle }}>
            <TextField
              size="small"
              value={ccEmails}
              onChange={(e) => onCcChange(e.target.value)}
              variant="standard"
              placeholder={t("frontdesk.compose.enterEmailAddresses")}
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              sx={fieldInputStyle}
            />
          </Box>
          <IconButton
            size="small"
            onClick={handleCloseCc}
            sx={{
              p: 0.5,
              color: colorTokens.neutral[400],
              borderRadius: `${radiusTokens.sm}px`,
              "&:hover": {
                color: colorTokens.neutral[600],
                backgroundColor: colorTokens.neutral[100],
              },
            }}
            aria-label="Remove CC field"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Collapse>

      {/* BCC Field (conditional) */}
      <Collapse in={showBcc} timeout={200}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            gap: 1.5,
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <Typography sx={labelStyle}>{t("frontdesk.compose.bcc")}</Typography>
          <Box sx={{ flex: 1, ...fieldContainerStyle }}>
            <TextField
              size="small"
              value={bccEmails}
              onChange={(e) => onBccChange(e.target.value)}
              variant="standard"
              placeholder={t("frontdesk.compose.enterEmailAddresses")}
              fullWidth
              InputProps={{
                disableUnderline: true,
              }}
              sx={fieldInputStyle}
            />
          </Box>
          <IconButton
            size="small"
            onClick={handleCloseBcc}
            sx={{
              p: 0.5,
              color: colorTokens.neutral[400],
              borderRadius: `${radiusTokens.sm}px`,
              "&:hover": {
                color: colorTokens.neutral[600],
                backgroundColor: colorTokens.neutral[100],
              },
            }}
            aria-label="Remove BCC field"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Collapse>
    </Stack>
  );
};
