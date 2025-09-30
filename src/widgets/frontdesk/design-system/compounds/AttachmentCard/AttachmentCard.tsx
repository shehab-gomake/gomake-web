import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { colorTokens, radiusTokens, semanticShadows } from '../../tokens';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';

export interface AttachmentCardProps {
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  mimeType?: string;
  /** Preview URL (for images) */
  previewUrl?: string;
  /** Download URL */
  url?: string;
  /** Upload date */
  uploadedAt?: string;
  /** Show remove button */
  onRemove?: () => void;
  /** Preview handler */
  onPreview?: () => void;
  /** Download handler */
  onDownload?: () => void;
  /** Size variant */
  variant?: 'compact' | 'default';
}

/**
 * Get file icon based on MIME type
 */
const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return <InsertDriveFileIcon />;

  if (mimeType.startsWith('image/')) return <ImageIcon />;
  if (mimeType === 'application/pdf') return <PictureAsPdfIcon />;
  if (mimeType.includes('document') || mimeType.includes('word')) return <DescriptionIcon />;
  if (mimeType.includes('text/') || mimeType.includes('code')) return <CodeIcon />;

  return <InsertDriveFileIcon />;
};

/**
 * Get file icon color based on MIME type
 */
const getFileIconColor = (mimeType?: string) => {
  if (!mimeType) return colorTokens.neutral[500];

  if (mimeType.startsWith('image/')) return colorTokens.primary[600];
  if (mimeType === 'application/pdf') return colorTokens.error[600];
  if (mimeType.includes('document') || mimeType.includes('word')) return colorTokens.info[600];
  if (mimeType.includes('text/') || mimeType.includes('code')) return colorTokens.success[600];

  return colorTokens.neutral[500];
};

/**
 * Format file size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Format date
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * AttachmentCard Component
 *
 * Displays file attachments with preview, download, and remove actions.
 * Supports images with thumbnail preview and various file types with appropriate icons.
 */
export const AttachmentCard: React.FC<AttachmentCardProps> = ({
  name,
  size,
  mimeType,
  previewUrl,
  url,
  uploadedAt,
  onRemove,
  onPreview,
  onDownload,
  variant = 'default',
}) => {
  const isImage = mimeType?.startsWith('image/');
  const isCompact = variant === 'compact';

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        alignItems: isCompact ? 'center' : 'flex-start',
        gap: isCompact ? 1.5 : 1,
        p: isCompact ? 1 : 1.5,
        width: isCompact ? '100%' : 140,
        border: `1px solid ${colorTokens.semantic.border.default}`,
        borderRadius: radiusTokens.md,
        cursor: onPreview ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: colorTokens.semantic.border.medium,
          backgroundColor: colorTokens.semantic.interactive.hover,
          '& .attachment-actions': {
            opacity: 1,
          },
        },
      }}
      onClick={onPreview}
    >
      {/* Remove button */}
      {onRemove && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            boxShadow: semanticShadows.sm,
            width: 20,
            height: 20,
            '&:hover': {
              backgroundColor: colorTokens.error[50],
              color: colorTokens.error[600],
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}

      {/* Preview/Icon */}
      {isImage && previewUrl ? (
        <Box
          component="img"
          src={previewUrl}
          alt={name}
          sx={{
            width: isCompact ? 48 : '100%',
            height: isCompact ? 48 : 80,
            objectFit: 'cover',
            borderRadius: radiusTokens.sm,
            backgroundColor: colorTokens.neutral[100],
            flexShrink: 0,
          }}
        />
      ) : (
        <Box
          sx={{
            width: isCompact ? 48 : '100%',
            height: isCompact ? 48 : 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colorTokens.neutral[50],
            borderRadius: radiusTokens.sm,
            color: getFileIconColor(mimeType),
            flexShrink: 0,
          }}
        >
          {React.cloneElement(getFileIcon(mimeType), {
            sx: { fontSize: isCompact ? 24 : 32 }
          })}
        </Box>
      )}

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: isCompact ? 13 : 11,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: colorTokens.semantic.text.primary,
            mb: 0.25,
          }}
          title={name}
        >
          {name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colorTokens.semantic.text.secondary,
            fontSize: isCompact ? 11 : 10,
            display: 'block',
          }}
        >
          {formatFileSize(size)}
        </Typography>
        {uploadedAt && !isCompact && (
          <Typography
            variant="caption"
            sx={{
              color: colorTokens.semantic.text.tertiary,
              fontSize: 10,
              display: 'block',
            }}
          >
            {formatDate(uploadedAt)}
          </Typography>
        )}
      </Box>

      {/* Actions (shown on hover) */}
      {(onPreview || onDownload) && (
        <Box
          className="attachment-actions"
          sx={{
            display: 'flex',
            gap: 0.5,
            opacity: isCompact ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          {onPreview && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              sx={{ width: 28, height: 28 }}
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          {onDownload && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              sx={{ width: 28, height: 28 }}
            >
              <DownloadIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Paper>
  );
};