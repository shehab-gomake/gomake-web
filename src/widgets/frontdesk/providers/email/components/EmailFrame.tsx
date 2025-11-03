/**
 * EmailFrame Component
 *
 * Renders email HTML content in a sandboxed iframe for complete isolation.
 * Features:
 * - Security: Sandboxed iframe blocks scripts and same-origin access
 * - Style Isolation: Email CSS cannot affect parent application
 * - Auto-resize: Dynamically adjusts height to fit content
 * - CID Images: Supports inline embedded images
 * - External Images: Optional blocking for privacy
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { EmailAttachment } from '../types/email.types';
import { useEmailContentProcessor } from '../hooks';

export interface EmailFrameProps {
  /** Raw HTML content from email */
  htmlContent: string;
  /** Email attachments for CID image processing */
  attachments?: EmailAttachment[];
  /** Allow external images (default: false for privacy) */
  allowExternalImages?: boolean;
  /** Additional CSS to inject into iframe */
  customStyles?: string;
  /** Callback when iframe height changes */
  onHeightChange?: (height: number) => void;
  /** Callback with processing metadata */
  onProcessed?: (metadata: {
    cidImagesReplaced: number;
    hasExternalImages: boolean;
    externalImageUrls: string[];
  }) => void;
}

/**
 * EmailFrame - Sandboxed iframe for secure email HTML rendering
 */
export const EmailFrame: React.FC<EmailFrameProps> = ({
  htmlContent,
  attachments = [],
  allowExternalImages = false,
  customStyles,
  onHeightChange,
  onProcessed
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(0);

  // Process email content
  const processed = useEmailContentProcessor({
    htmlContent,
    attachments,
    allowExternalImages,
    customStyles
  });

  // Notify parent about processing results
  useEffect(() => {
    if (onProcessed) {
      onProcessed({
        cidImagesReplaced: processed.cidImagesReplaced,
        hasExternalImages: processed.hasExternalImages,
        externalImageUrls: processed.externalImageUrls
      });
    }
  }, [
    processed.cidImagesReplaced,
    processed.hasExternalImages,
    processed.externalImageUrls,
    onProcessed
  ]);

  // Listen for resize messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify message is from our iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      // Handle resize message
      if (event.data?.type === 'email-iframe-resize') {
        const newHeight = event.data.height;
        if (typeof newHeight === 'number' && newHeight > 0) {
          setIframeHeight(newHeight);
          onHeightChange?.(newHeight);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onHeightChange]);

  if (!htmlContent) {
    return (
      <Box sx={{ p: 2, color: 'text.secondary', fontStyle: 'italic' }}>
        No content to display
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper'
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={processed.html}
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        style={{
          width: '100%',
          height: iframeHeight > 0 ? `${iframeHeight}px` : '400px',
          border: 'none',
          display: 'block',
          transition: 'height 0.2s ease-out'
        }}
        title="Email content"
        loading="lazy"
      />
    </Box>
  );
};

export default EmailFrame;
