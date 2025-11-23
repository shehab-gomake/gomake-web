/**
 * EmailMessageBody Component
 *
 * Complete email message viewer integrating:
 * - EmailHeader (metadata, timestamps)
 * - EmailFrame (sandboxed HTML rendering)
 * - EmailAttachmentList (downloadable files)
 * - External image controls
 * - CID inline image processing
 *
 * This component replaces the old dangerouslySetInnerHTML approach
 * with a secure, isolated, Gmail/Outlook-style email viewer.
 */

import React from 'react';
import { Box, Paper } from '@mui/material';
import { EmailMessage } from '../types/email.types';
import { EmailHeader } from './EmailHeader';
import { EmailFrame } from './EmailFrame';
import { EmailAttachmentList } from './message-viewer/email-attachment-list';
import { useExternalImageControl } from '../hooks';

export interface EmailMessageBodyProps {
  /** Email message to display */
  message: EmailMessage;
  /** Email account ID (for attachment downloads) */
  accountId: string;
  /** Whether to persist external image preferences (default: true) */
  persistImagePreferences?: boolean;
  /** Custom CSS to inject into email iframe */
  customIframeStyles?: string;
}

/**
 * EmailMessageBody - Complete email viewer with security and privacy controls
 *
 * @example
 * ```tsx
 * <EmailMessageBody
 *   message={emailMessage}
 *   accountId={accountId}
 *   persistImagePreferences={true}
 * />
 * ```
 */
export const EmailMessageBody: React.FC<EmailMessageBodyProps> = ({
  message,
  accountId,
  persistImagePreferences = true,
  customIframeStyles
}) => {
  // External image control
  const { allowed: externalImagesAllowed, allowImages } = useExternalImageControl({
    emailId: message.id,
    senderEmail: message.from[0]?.email,
    persist: persistImagePreferences
  });

  // Use HTML if available, otherwise fall back to plain text
  const htmlContent = message.html || message.text || '';

  // If we only have plain text, convert it to basic HTML
  const finalHtmlContent = message.html
    ? message.html
    : `<div style="white-space: pre-wrap;">${htmlContent}</div>`;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      {/* Email Header with metadata */}
      <EmailHeader
        subject={message.subject}
        from={message.from}
        to={message.to}
        cc={message.cc}
        bcc={message.bcc}
        date={message.date}
        hasExternalImages={!externalImagesAllowed}
        onAllowExternalImages={allowImages}
        externalImagesAllowed={externalImagesAllowed}
      />

      {/* Email Body in sandboxed iframe */}
      <Box sx={{ p: 0 }}>
        <EmailFrame
          htmlContent={finalHtmlContent}
          attachments={message.attachments}
          allowExternalImages={externalImagesAllowed}
          customStyles={customIframeStyles}
        />
      </Box>

      {/* Downloadable Attachments (filters out inline CID images) */}
      {message.attachments && message.attachments.length > 0 && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <EmailAttachmentList
            attachments={message.attachments}
            accountId={accountId}
            messageId={message.id}
            filterInlineAttachments={true}
          />
        </Box>
      )}
    </Paper>
  );
};

export default EmailMessageBody;
