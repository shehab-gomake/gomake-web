import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * OAuth Callback Handler View
 *
 * This component handles the OAuth redirect after Gmail/Outlook authentication.
 * It extracts accountId and inboxId from URL params and communicates with the
 * parent window (the modal) via postMessage.
 *
 * Expected URL pattern:
 * /frontdesk?channel=chatwoot&view=oauth-callback&accountId=29&inboxId=7
 *
 * Flow:
 * 1. Parse URL params (accountId, inboxId)
 * 2. Send postMessage to window.opener with the data
 * 3. Display success message
 * 4. Auto-close popup after 1 second
 */
export const OAuthCallbackView = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract URL parameters
        const { accountId, inboxId } = router.query;

        // Validate required parameters
        if (!accountId || !inboxId) {
          throw new Error(
            'Missing required parameters. Expected accountId and inboxId in URL.'
          );
        }

        // Parse to numbers
        const parsedAccountId = parseInt(accountId as string, 10);
        const parsedInboxId = parseInt(inboxId as string, 10);

        // Validate parsed values
        if (isNaN(parsedAccountId) || isNaN(parsedInboxId)) {
          throw new Error('Invalid accountId or inboxId - must be numbers.');
        }

        // Send success message to parent window (the modal)
        if (window.opener) {
          window.opener.postMessage(
            {
              source: 'chatwoot-oauth',
              status: 'success',
              accountId: parsedAccountId,
              inboxId: parsedInboxId,
            },
            window.location.origin
          );

          setStatus('success');

          // Auto-close popup after 1 second
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          throw new Error('No parent window found. This page must be opened in a popup.');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setErrorMessage(error.message || 'An unexpected error occurred.');
        setStatus('error');
      }
    };

    // Only run when router is ready
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady, router.query]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      {status === 'loading' && (
        <>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Processing authentication...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please wait while we complete the setup.
          </Typography>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            Authentication successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This window will close automatically...
          </Typography>
        </>
      )}

      {status === 'error' && (
        <>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="error">
            Authentication failed
          </Typography>
          <Alert severity="error" sx={{ mt: 2, maxWidth: 400 }}>
            {errorMessage}
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You can close this window and try again.
          </Typography>
        </>
      )}
    </Box>
  );
};
