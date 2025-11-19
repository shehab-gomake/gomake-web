/**
 * EmailHeader Component
 *
 * Displays email metadata in a Gmail/Outlook-style header.
 * Shows: From, To, Cc, Bcc, Date, Subject
 * Features:
 * - Expandable recipient list (show all Cc/Bcc)
 * - Formatted timestamps
 * - "Display images" prompt for external content
 * - Collapsible quoted reply toggle (future)
 */

import React, { useState } from 'react';
import { Box, Typography, Chip, IconButton, Alert, Button, Collapse } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { EmailRecipient } from '../types/email.types';
import { formatDistanceToNow } from 'date-fns';

export interface EmailHeaderProps {
  /** Email subject */
  subject: string;
  /** Sender information */
  from: EmailRecipient[];
  /** Primary recipients */
  to: EmailRecipient[];
  /** CC recipients */
  cc?: EmailRecipient[];
  /** BCC recipients */
  bcc?: EmailRecipient[];
  /** Email date */
  date: string;
  /** Whether email has external images */
  hasExternalImages?: boolean;
  /** Callback when user allows external images */
  onAllowExternalImages?: () => void;
  /** Whether external images are currently allowed */
  externalImagesAllowed?: boolean;
}

/**
 * Format email recipient for display
 */
function formatRecipient(recipient: EmailRecipient): string {
  if (recipient.name) {
    return `${recipient.name} <${recipient.email}>`;
  }
  return recipient.email;
}

/**
 * Format recipient list with optional "show more"
 */
const RecipientList: React.FC<{
  recipients: EmailRecipient[];
  label: string;
  maxInitial?: number;
}> = ({ recipients, label, maxInitial = 2 }) => {
  const [showAll, setShowAll] = useState(false);

  if (!recipients || recipients.length === 0) return null;

  const displayRecipients = showAll ? recipients : recipients.slice(0, maxInitial);
  const hasMore = recipients.length > maxInitial;

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 40 }}>
        {label}:
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        {displayRecipients.map((recipient, index) => (
          <Chip
            key={index}
            label={formatRecipient(recipient)}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        ))}
        {hasMore && !showAll && (
          <Button size="small" onClick={() => setShowAll(true)} sx={{ fontSize: '0.75rem' }}>
            +{recipients.length - maxInitial} more
          </Button>
        )}
        {hasMore && showAll && (
          <Button size="small" onClick={() => setShowAll(false)} sx={{ fontSize: '0.75rem' }}>
            Show less
          </Button>
        )}
      </Box>
    </Box>
  );
};

/**
 * EmailHeader - Gmail/Outlook style email metadata display
 */
export const EmailHeader: React.FC<EmailHeaderProps> = ({
  subject,
  from,
  to,
  cc,
  bcc,
  date,
  hasExternalImages = false,
  onAllowExternalImages,
  externalImagesAllowed = false
}) => {
  const [expanded, setExpanded] = useState(false);

  // Format date
  const formattedDate = date
    ? `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`
    : '';
  const relativeDate = date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        p: 2
      }}
    >
      {/* Subject */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {subject || '(No Subject)'}
      </Typography>

      {/* External Images Alert */}
      {hasExternalImages && !externalImagesAllowed && (
        <Alert
          severity="info"
          icon={<ImageIcon />}
          action={
            <Button color="primary" size="small" onClick={onAllowExternalImages}>
              Display Images
            </Button>
          }
          sx={{ mb: 2 }}
        >
          External images were blocked for your privacy
        </Alert>
      )}

      {/* From */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <RecipientList recipients={from} label="From" maxInitial={1} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {formattedDate}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>
            {relativeDate}
          </Typography>
        </Box>
      </Box>

      {/* To (always show) */}
      <RecipientList recipients={to} label="To" maxInitial={2} />

      {/* Expandable section for Cc/Bcc */}
      {(cc && cc.length > 0) || (bcc && bcc.length > 0) ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ mr: 0.5, p: 0.5 }}
            >
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
            <Typography variant="caption" sx={{ color: 'text.secondary', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Hide details' : 'Show details'}
            </Typography>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ mt: 1, pl: 3 }}>
              {cc && cc.length > 0 && <RecipientList recipients={cc} label="Cc" maxInitial={5} />}
              {bcc && bcc.length > 0 && <RecipientList recipients={bcc} label="Bcc" maxInitial={5} />}
            </Box>
          </Collapse>
        </>
      ) : null}
    </Box>
  );
};

export default EmailHeader;
