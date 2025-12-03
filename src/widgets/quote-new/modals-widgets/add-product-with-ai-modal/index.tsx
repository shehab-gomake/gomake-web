import { useTranslation } from "react-i18next";
import { GoMakeDialog, GomakeTextInput, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";
import { useAddProductWithAI } from "./use-add-product-with-ai";
import { Stack, Typography } from "@mui/material";
import { UploadNewIcon } from "@/icons";
import { useRef } from "react";

interface AddProductWithAIModalProps {
  open: boolean;
  onClose: () => void;
  quoteId?: string;
  onSuccess?: () => void;
}

const AddProductWithAIModal = ({
  open,
  onClose,
  quoteId,
  onSuccess,
}: AddProductWithAIModalProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    prompt,
    setPrompt,
    isProcessing,
    handleSubmitPrompt,
    handleFileUpload,
    handleFileSelect,
    selectedFileName,
  } = useAddProductWithAI({
    quoteId,
    onSuccess: () => {
      // Don't close modal immediately - let user see the success message
      // Modal will be closed manually or when calculation completes
      // The quote will be updated automatically via Socket.io
    },
  });

  const handlePrimaryAction = () => {
    handleSubmitPrompt();
    // Close modal after a short delay to show success message
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("sales.quote.addProductWithAI")}
      showFooter={true}
      primaryButtonLabel={isProcessing ? t("sales.quote.processing") : t("sales.quote.addProduct")}
      onPrimaryAction={handlePrimaryAction}
      primaryButtonDisabled={isProcessing || (!prompt.trim() && !selectedFileName)}
      primaryButtonLoading={isProcessing}
      maxWidth="sm"
    >
      <Stack spacing={3} style={classes.contentContainer}>
        <Typography variant="body1" style={classes.description}>
          {t("sales.quote.addProductWithAIDescription")}
        </Typography>

        {/* Prompt Input Section */}
        <Stack spacing={2}>
          <Typography variant="subtitle2" style={classes.sectionTitle}>
            {t("sales.quote.enterPrompt")}
          </Typography>
          <GomakeTextInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("sales.quote.promptPlaceholder")}
            multiline
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto",
                minHeight: "100px",
                alignItems: "flex-start",
                paddingTop: "8px",
              },
              "& textarea": {
                minHeight: "84px",
              },
            }}
            disabled={isProcessing}
            style={classes.textInput}
          />
        </Stack>

        {/* Divider */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          style={classes.dividerContainer}
        >
          <div style={classes.divider} />
          <Typography variant="body2" style={classes.dividerText}>
            {t("sales.quote.or")}
          </Typography>
          <div style={classes.divider} />
        </Stack>

        {/* Excel Upload Section */}
        <Stack spacing={2}>
          <Typography variant="subtitle2" style={classes.sectionTitle}>
            {t("sales.quote.uploadExcelFile")}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={isProcessing}
          />
          <GomakePrimaryButton
            variant="contained"
            leftIcon={
              <span style={{ display: "flex", alignItems: "center", filter: "brightness(0) invert(1)" }}>
                <UploadNewIcon />
              </span>
            }
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            style={classes.uploadButton}
          >
            {selectedFileName || t("sales.quote.selectExcelFile")}
          </GomakePrimaryButton>
          {selectedFileName && (
            <Typography variant="caption" style={classes.fileName}>
              {selectedFileName}
            </Typography>
          )}
        </Stack>
      </Stack>
    </GoMakeDialog>
  );
};

export { AddProductWithAIModal };

