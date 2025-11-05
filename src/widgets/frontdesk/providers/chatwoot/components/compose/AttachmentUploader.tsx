/**
 * Attachment Uploader Component
 *
 * Handles file selection and displays attachment previews.
 * Used for email and web widget channels that support attachments.
 */

import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { AttachmentPreviews } from "./AttachmentPreview";
import { createFieldContainerStyles, createSectionLabelStyles, createOutlinedButtonStyles } from "../../styles/compose-styles";

export interface AttachmentUploaderProps {
  /** Currently selected files */
  files: File[];
  /** File selection handler */
  onFilesSelect: (files: File[]) => void;
  /** File removal handler */
  onFileRemove: (index: number) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Attachment Uploader
 * Renders file upload button and attachment previews
 */
export const AttachmentUploader = React.memo<AttachmentUploaderProps>(
  ({ files, onFilesSelect, onFileRemove, disabled = false }) => {
    const { neutralColor, primaryColor } = useGomakeTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesSelect([...files, ...selectedFiles]);
      }
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <Box sx={createFieldContainerStyles(neutralColor, { backgroundColor: "light" })}>
        <Box sx={{ width: "100%" }}>
          <Typography sx={createSectionLabelStyles(neutralColor)}>Attachments</Typography>
          <Button
            onClick={handleButtonClick}
            disabled={disabled}
            startIcon={<AttachFileIcon sx={{ fontSize: 18 }} />}
            variant="outlined"
            sx={createOutlinedButtonStyles(neutralColor, primaryColor)}
            aria-label="Choose files to attach"
          >
            Choose Files
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFileSelect}
              disabled={disabled}
              aria-label="File input"
            />
          </Button>
          <AttachmentPreviews files={files} onRemove={onFileRemove} />
        </Box>
      </Box>
    );
  }
);

AttachmentUploader.displayName = "AttachmentUploader";
