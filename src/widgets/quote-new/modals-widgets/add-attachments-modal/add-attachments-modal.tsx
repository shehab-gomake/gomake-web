import { GoMakeModal } from "@/components";
import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useAddAttachmentsModal } from "./use-add-attachments-modal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/button/primary-button";

const AddAttachmentsModal = ({
  openModal,
  onClose,
  documentType,
  getQuote,
  isQuoteConfirmation,
  quoteConfirm,
  onFileUploadStart,
  onFileUploadComplete,
  onContinueApproval = undefined,
}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    handleFileUploadQuoteConfirmation,
    getAttachmentsRowsQuoteConfirmation,
  } = useAddAttachmentsModal({
    getQuote,
    documentType,
    quoteConfirm,
    isQuoteConfirmation,
    onFileUploadStart,
    onFileUploadComplete,
    onContinueApproval,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Determine modal title based on whether onContinueApproval is provided
  const getModalTitle = () => {
    if (onContinueApproval) {
      return t("sales.quote.noFilesAttached");
    }
    return quoteConfirm?.attachments?.length > 0
      ? t("sales.quote.editAttachments")
      : t("sales.quote.addAttachments");
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={getModalTitle()}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.modalContentContainer}>
          {/* Scrollable Content Area */}
          <div style={classes.scrollableContent}>
            {isQuoteConfirmation ? (
              <div>
                {quoteConfirm?.documentItems?.map(
                  (item: any, index: number) => {
                    return (
                      item.isChecked && item.workName && (
                        <div key={index}>
                          <h4
                            style={{ marginBottom: "10px", marginTop: "10px" }}
                          >
                            {item.productName} ({item?.workName})
                          </h4>
                          <div>
                            <PrimaryTable
                              stickyFirstCol={false}
                              stickyHeader={true}
                              maxHeight={400}
                              rows={getAttachmentsRowsQuoteConfirmation(item)}
                              headers={[
                                "",
                                t("fileUploader.fileName"),
                                t("fileUploader.downloadFile"),
                                t("fileUploader.deleteFile"),
                              ]}
                              columnWidths={["10%", "55%", "15%", "20%"]}
                            />
                            <div
                              onClick={() =>
                                document
                                  .getElementById(`file-upload-${index}`)
                                  .click()
                              }
                              role="region"
                              aria-label="File Upload Drop Area"
                              aria-describedby={`upload-instruction-${index}`}
                              tabIndex={0}
                              className={`drop-area ${isDragging ? "dragging" : ""
                                }`}
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
                                  const event = { target: { files } } as any;
                                  handleFileUploadQuoteConfirmation(
                                    event,
                                    item
                                  );

                                  // Reset the file input value so the same file can be selected again
                                  const fileInput = document.getElementById(
                                    `file-upload-${index}`
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.value = "";
                                  }
                                }
                              }}
                            >
                              <p
                                id={`upload-instruction-${index}`}
                                className="sr-only"
                              >
                                {t("fileUploader.dragAndDropUpload")}
                              </p>
                            </div>
                          </div>
                          <input
                            id={`file-upload-${index}`}
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFileUploadQuoteConfirmation(e, item)
                            }
                          />
                        </div>
                      )
                    );
                  }
                )}
              </div>
            ) : (
              <div>
                {quoteConfirm?.documentItems?.map(
                  (item: any, index: number) => {
                    return (
                      item.isSelected && item.workName && (
                        <div key={index}>
                          <h4
                            style={{ marginBottom: "10px", marginTop: "10px" }}
                          >
                            {item.productName} ({item?.workName})
                          </h4>
                          <div>
                            <PrimaryTable
                              stickyFirstCol={false}
                              stickyHeader={true}
                              maxHeight={400}
                              rows={getAttachmentsRowsQuoteConfirmation(item)}
                              headers={[
                                "",
                                t("fileUploader.fileName"),
                                t("fileUploader.downloadFile"),
                                t("fileUploader.deleteFile"),
                              ]}
                              columnWidths={["10%", "55%", "15%", "20%"]}
                            />
                            <div
                              onClick={() =>
                                document
                                  .getElementById(`file-upload-${index}`)
                                  .click()
                              }
                              role="region"
                              aria-label="File Upload Drop Area"
                              aria-describedby={`upload-instruction-${index}`}
                              tabIndex={0}
                              className={`drop-area ${isDragging ? "dragging" : ""
                                }`}
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
                                  const event = { target: { files } } as any;
                                  handleFileUploadQuoteConfirmation(
                                    event,
                                    item
                                  );

                                  // Reset the file input value so the same file can be selected again
                                  const fileInput = document.getElementById(
                                    `file-upload-${index}`
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.value = "";
                                  }
                                }
                              }}
                            >
                              <p
                                id={`upload-instruction-${index}`}
                                className="sr-only"
                              >
                                {t("fileUploader.dragAndDropUpload")}
                              </p>
                            </div>
                          </div>
                          <input
                            id={`file-upload-${index}`}
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFileUploadQuoteConfirmation(e, item)
                            }
                          />
                        </div>
                      )
                    );
                  }
                )}
              </div>
            )}
          </div>
          {/* Fixed Footer Buttons */}
          {onContinueApproval && (
            <div style={classes.fixedFooter}>
              <PrimaryButton variant="outlined" onClick={onClose}>
                {t("sales.quote.cancel")}
              </PrimaryButton>
              <PrimaryButton variant="contained" onClick={onContinueApproval}>
                {t("sales.quote.continueToSign")}
              </PrimaryButton>
            </div>
          )}
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddAttachmentsModal };
