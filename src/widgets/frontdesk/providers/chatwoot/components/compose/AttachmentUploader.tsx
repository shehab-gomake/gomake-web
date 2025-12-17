/**
 * Attachment Uploader Component
 *
 * Handles file selection and displays attachment previews.
 * Used for email and web widget channels that support attachments.
 * Matches Chatwoot's attachment upload patterns with file size validation.
 */

import React, { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import { AttachmentPreviews } from "./AttachmentPreview";
import {
  createFieldContainerStyles,
  createSectionLabelStyles,
  createOutlinedButtonStyles,
} from "../../styles/compose-styles";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("AttachmentUploader");

// Maximum file upload size in MB (matching Chatwoot's MAXIMUM_FILE_UPLOAD_SIZE)
const MAXIMUM_FILE_UPLOAD_SIZE_MB = 40;

// Convert MB to bytes
const fileSizeInMegaBytes = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

// Check if file size is within limit
const checkFileSizeLimit = (
  file: File,
  maximumUploadLimitMB: number
): boolean => {
  const fileSizeInMB = fileSizeInMegaBytes(file.size);
  return fileSizeInMB <= maximumUploadLimitMB;
};

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
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length === 0) return;

      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      selectedFiles.forEach((file) => {
        if (checkFileSizeLimit(file, MAXIMUM_FILE_UPLOAD_SIZE_MB)) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
          logger.warn(
            `File ${file.name} exceeds size limit of ${MAXIMUM_FILE_UPLOAD_SIZE_MB}MB`
          );
        }
      });

      if (invalidFiles.length > 0) {
        // TODO: Show user-friendly error toast/snackbar
        console.warn(
          `The following files exceed the ${MAXIMUM_FILE_UPLOAD_SIZE_MB}MB limit: ${invalidFiles.join(
            ", "
          )}`
        );
      }

      if (validFiles.length > 0) {
        onFilesSelect([...files, ...validFiles]);
        logger.debug(`Added ${validFiles.length} valid file(s)`);
      }

      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const isRTL = dir === "rtl";

    return (
      <Box
        sx={{
          ...createFieldContainerStyles({ backgroundColor: "light" }),
          direction: dir,
        }}
      >
        <Box sx={{ width: "100%", direction: dir }}>
          <Typography sx={{ ...createSectionLabelStyles(), direction: dir }}>
            {t("frontdesk.compose.attachments")}
          </Typography>
          <Button
            onClick={handleButtonClick}
            disabled={disabled}
            startIcon={<AttachFileIcon sx={{ fontSize: 18 }} />}
            variant="outlined"
            sx={{
              ...createOutlinedButtonStyles(),
              direction: dir,
              "& .MuiButton-startIcon": {
                ...(isRTL
                  ? { marginLeft: "4px", marginRight: 0 }
                  : { marginRight: "4px", marginLeft: 0 }),
              },
            }}
            aria-label={t("frontdesk.compose.chooseFiles")}
          >
            {t("frontdesk.compose.chooseFiles")}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFileSelect}
              disabled={disabled}
              aria-label={t("frontdesk.compose.chooseFiles")}
            />
          </Button>
          <AttachmentPreviews files={files} onRemove={onFileRemove} />
        </Box>
      </Box>
    );
  }
);

AttachmentUploader.displayName = "AttachmentUploader";
