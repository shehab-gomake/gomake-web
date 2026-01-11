import { GoMakeModal, GomakeTextInput, GoMakeAutoComplate } from "@/components";
import { useStyle } from "@/widgets/quote-new/modals-widgets/style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useGraphicsApprovalUpload } from "./use-graphics-approval-upload";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { IconButton, TextField, Stack, Typography, Box, Paper, Popper } from "@mui/material";
import { styled } from "@mui/material/styles";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { getLabelTypography } from "@/utils/typography-utils";

// Custom Popper with high z-index to appear above modal and match input width
const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: 99999999999,
  "&[data-popper-placement]": {
    width: "var(--popper-anchor-width)",
  },
  "& .MuiAutocomplete-paper": {
    zIndex: 99999999999,
    width: "var(--popper-anchor-width)",
    minWidth: "var(--popper-anchor-width)",
  },
  "& .MuiAutocomplete-listbox": {
    zIndex: 99999999999,
    width: "100%",
  },
}));

const GraphicsApprovalUploadModal = ({
  openModal,
  onClose,
  boardMissionId,
  orderItemId,
  orderId,
  productType,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    handleFileUpload,
    uploadedFiles,
    uploadingFiles,
    handleDeleteFile,
    handleDownloadFile,
    handleSendGraphicsApproval,
    handleUpdateFileDescription,
    deletingFiles,
    downloadingFiles,
    isSending,
    documentContacts,
    selectedContactIndex,
    handleContactChange,
    isLoadingContacts,
    contactEmail,
    setContactEmail,
  } = useGraphicsApprovalUpload({
    boardMissionId,
    orderItemId,
    orderId,
    productType,
    openModal,
  });
  const [isDragging, setIsDragging] = useState(false);

  const getFileRows = () => {
    const rows = [];

    // Add uploading files
    uploadingFiles.forEach((file, index) => {
      rows.push([
        <DotsLoader key={`uploading-loader-${file.name}-${index}`} />,
        <h4
          key={`uploading-${file.name}-${index}`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.name.length > 50
            ? `${file.name.substring(0, 35)}...`
            : file.name}
        </h4>,
        <div
          key={`uploading-description-${file.name}-${index}`}
          style={{ opacity: 0.5 }}
        >
          <TextField
            disabled
            size="small"
            placeholder={t("fileUploader.description") || "Description"}
            sx={{ width: "100%" }}
          />
        </div>,
        <div
          key={`uploading-download-${file.name}-${index}`}
          style={{ opacity: 0.5 }}
        >
          <IconButton disabled>
            <FileOpenIcon />
          </IconButton>
        </div>,
        <div
          key={`uploading-delete-${file.name}-${index}`}
          style={{ opacity: 0.5 }}
        >
          <IconButton disabled>
            <WastebasketNew width={32} height={32} />
          </IconButton>
        </div>,
      ]);
    });

    // Add uploaded files
    uploadedFiles.forEach((file, index) => {
      rows.push([
        <div key={`empty-${file?.fileName}-${index}`}></div>,
        <h4
          key={`file-${file?.fileName}-${index}`}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.fileName && file.fileName.length > 50
            ? `${file.fileName.substring(0, 35)}...`
            : file.fileName}
        </h4>,
        <TextField
          key={`description-${file?.fileName}-${index}`}
          size="small"
          placeholder={t("fileUploader.description") || "Description"}
          value={file?.description || ""}
          onChange={(e) => handleUpdateFileDescription(file.bucketKey, e.target.value)}
          disabled={deletingFiles.includes(file.bucketKey)}
          sx={{ width: "100%" }}
        />,
        <IconButton
          key={`download-${file.fileName}-${index}`}
          onClick={() => handleDownloadFile(file.bucketKey)}
          disabled={downloadingFiles.includes(file.bucketKey)}
        >
          {downloadingFiles.includes(file.bucketKey) ? (
            <DotsLoader />
          ) : (
            <FileOpenIcon />
          )}
        </IconButton>,
        <IconButton
          key={`delete-${file.fileName}-${index}`}
          onClick={() => handleDeleteFile(file.bucketKey, file.fileName, file.url)}
          disabled={deletingFiles.includes(file.bucketKey)}
        >
          {deletingFiles.includes(file.bucketKey) ? (
            <DotsLoader />
          ) : (
            <WastebasketNew width={32} height={32} />
          )}
        </IconButton>,
      ]);
    });

    return rows;
  };

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={t("productionFloor.sendGraphicsApprove")}
      onClose={onClose}
      insideStyle={classes.insideStyle}
      sx={{ zIndex: 9999999999 }}
      style={{ zIndex: 9999999999 }}
    >
      <div style={classes.modalContentContainer}>
        {/* Scrollable Content Area */}
        <div style={classes.scrollableContent}>
          {/* Contact Selector */}
          {orderId && (
            <Stack direction="row" alignItems="center" gap="16px" sx={{ marginBottom: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography style={getLabelTypography()}>
                  {t("customers.modal.contacts") || "Contact"}
                </Typography>
                <Box sx={{ width: "300px" }}>
                  <GoMakeAutoComplate
                    value={documentContacts.length > 0 && selectedContactIndex >= 0 ? documentContacts[selectedContactIndex] : null}
                    onChange={(e: any, value: any) => {
                      handleContactChange(value);
                    }}
                    options={documentContacts}
                    getOptionLabel={(option: any) => 
                      option?.contactName || option?.name || ""
                    }
                    placeholder={
                      isLoadingContacts 
                        ? t("common.loading") || "Loading..." 
                        : documentContacts.length === 0
                        ? t("customers.modal.noContacts") || "No contacts available"
                        : t("prePayment.selectContact") || "Select contact"
                    }
                    loading={isLoadingContacts}
                    disabled={isSending || isLoadingContacts}
                    disableClearable={false}
                    defaultFiltering={true}
                    disablePortal={false}
                    PopperComponent={StyledPopper}
                    componentsProps={{
                      popper: {
                        sx: {
                          zIndex: "99999999999 !important",
                        },
                        style: {
                          zIndex: 99999999999,
                        },
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [0, 4],
                            },
                          },
                          {
                            name: "preventOverflow",
                            enabled: true,
                          },
                          {
                            name: "flip",
                            enabled: false,
                          },
                          {
                            name: "sameWidth",
                            enabled: true,
                            phase: "beforeWrite",
                            requires: ["computeStyles"],
                            fn: ({ state }) => {
                              state.styles.popper.width = `${state.rects.reference.width}px`;
                            },
                            effect: ({ state }) => {
                              state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
                            },
                          },
                        ],
                      },
                      listbox: {
                        sx: {
                          zIndex: 99999999999,
                        },
                      },
                    }}
                  />
                </Box>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography style={getLabelTypography()}>
                  {t("sales.quote.email") || "Email"}
                </Typography>
                <Box sx={{ width: "300px" }}>
                  <GomakeTextInput
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder={t("sales.quote.email") || "Email"}
                    disabled={isSending}
                  />
                </Box>
              </div>
            </Stack>
          )}
          <div>
            <PrimaryTable
              stickyFirstCol={false}
              stickyHeader={true}
              maxHeight={400}
              rows={getFileRows()}
              headers={[
                "",
                t("fileUploader.fileName"),
                t("fileUploader.description") || "Description",
                t("fileUploader.downloadFile"),
                t("fileUploader.deleteFile"),
              ]}
              columnWidths={["5%", "30%", "30%", "15%", "20%"]}
            />
            <div
              onClick={() => document.getElementById("graphics-file-upload").click()}
              role="region"
              aria-label="File Upload Drop Area"
              aria-describedby="upload-instruction"
              tabIndex={0}
              className={`drop-area ${isDragging ? "dragging" : ""}`}
              style={{
                ...classes.attachmentsContainer,
                border: "2px dashed #ccc",
                borderTop: "none",
                backgroundColor: isDragging
                  ? "rgba(0, 123, 255, 0.1)"
                  : "transparent",
                transition: "all 0.3s ease",
                padding: "20px",
                borderRadius: "4px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  Array.from(files).forEach((file) => {
                    const event = { target: { files: [file] } } as any;
                    handleFileUpload(event);
                  });
                  // Reset the file input value so the same file can be selected again
                  const fileInput = document.getElementById(
                    "graphics-file-upload"
                  ) as HTMLInputElement;
                  if (fileInput) {
                    fileInput.value = "";
                  }
                }
              }}
            >
              <p id="upload-instruction" className="sr-only">
                {t("fileUploader.dragAndDropUpload")}
              </p>
            </div>
          </div>
          <input
            id="graphics-file-upload"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                Array.from(e.target.files).forEach((file) => {
                  const event = { target: { files: [file] } } as any;
                  handleFileUpload(event);
                });
                // Reset the file input value so the same file can be selected again
                e.target.value = "";
              }
            }}
          />
        </div>
        {/* Fixed Footer with Send Button */}
        <div style={classes.fixedFooter}>
          <PrimaryButton variant="outlined" onClick={onClose} disabled={isSending}>
            {t("sales.quote.cancel")}
          </PrimaryButton>
          <PrimaryButton
            variant="contained"
            onClick={() => handleSendGraphicsApproval(onClose)}
            disabled={uploadedFiles.length === 0 || uploadingFiles.length > 0 || isSending}
          >
            {isSending ? t("sales.quote.sending") || "Sending..." : t("sales.quote.send") || "Send"}
          </PrimaryButton>
        </div>
      </div>
    </GoMakeModal>
  );
};

export { GraphicsApprovalUploadModal };

