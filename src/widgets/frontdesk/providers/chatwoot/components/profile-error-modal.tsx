import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ProfileErrorModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Callback when modal should be closed
   */
  onClose?: () => void;

  /**
   * Error object or message (used internally for logging, not displayed to user)
   */
  error?: Error | string | null;

  /**
   * Callback when retry button is clicked
   */
  onRetry?: () => void;

}

/**
 * Profile Error Modal Component
 *
 * Displays a modal when Chatwoot profile fails to load.
 * Uses the same design pattern as the ErrorState component but in a modal format.
 *
 * @example
 * ```tsx
 * <ProfileErrorModal
 *   open={!!profileError}
 *   error={profileError}
 *   onRetry={handleRetryProfile}
 * />
 * ```
 */
export const ProfileErrorModal: React.FC<ProfileErrorModalProps> = ({
  open,
  onClose,
  error,
  onRetry,
}) => {
  const theme = useTheme();
  const { neutralColor } = useGomakeTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      <DialogContent
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 56,
              color: alpha(theme.palette.error.main, 0.6),
            }}
          />
        </Box>

        {/* Text Content */}
        <Stack spacing={1} sx={{ mb: 3, maxWidth: 500 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: neutralColor(900),
            }}
          >
            Failed to load conversations
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: neutralColor(600),
              lineHeight: 1.6,
            }}
          >
            We couldn't load your conversations. Please check your connection and try again.
          </Typography>
        </Stack>


        {/* Actions */}
        <Stack direction="row" spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
          {onRetry && (
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
              sx={{
                backgroundColor: theme.palette.primary.main,
                borderRadius: "8px",
                px: 3,
                py: 1,
                textTransform: "uppercase",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              Try Again
            </Button>
          )}
        </Stack>

        {/* Help Text */}
        <Typography
          variant="caption"
          sx={{
            mt: 4,
            color: neutralColor(500),
          }}
        >
          If this problem continues, please contact support
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

