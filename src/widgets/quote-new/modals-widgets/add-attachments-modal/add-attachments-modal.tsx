import { GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { ModalType } from "@/enums";
import { useAddAttachmentsModal } from "./use-add-attachments-modal";
import { GomakeLoadingWithShadow } from "@/widgets/loading-with-shadow/loading";
import { useState } from "react";
import { Divider } from "@mui/material";

const AddAttachmentsModal = ({ openModal, onClose, documentType, getQuote, isQuoteConfirmation, quoteConfirm }) => {
  const { classes } = useStyle();
  const {
    t,
    handleFileUpload,
    getAttachmentsRows,
    handleDeleteAttachment,
    onClickCloseDeleteModal,
    selectedAttachment,
    quoteItemValue,
    openDeleteModal,
    isLoading,
    handleFileUploadQuoteConfirmation,
    getAttachmentsRowsQuoteConfirmation,
    handleDeleteFileFromItems
  } = useAddAttachmentsModal({ getQuote, documentType });
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={quoteItemValue?.attachments?.length > 0
          ? t("sales.quote.editAttachments")
          : t("sales.quote.addAttachments")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        {
          isQuoteConfirmation ? <div>
            {quoteConfirm?.documentItems?.map((item: any, index: number) => {
              return (
                item.isChecked && (
                  <div key={index} >
                    <h4 style={{ marginBottom: '10px', marginTop: '10px' }}>{item.productName} ({item?.workName})</h4>
                    <div >

                      <PrimaryTable
                        stickyFirstCol={false}
                        stickyHeader={true}
                        maxHeight={400}
                        rows={getAttachmentsRowsQuoteConfirmation(item)}
                        headers={[
                          t("fileUploader.fileName"),
                          t("fileUploader.downloadFile"),
                          t("fileUploader.deleteFile"),
                        ]}
                        columnWidths={["70%", "15%", "15%", "15%"]}
                      />
                      <div
                        onClick={() => document.getElementById(`file-upload-${index}`).click()}
                        role="region"
                        aria-label="File Upload Drop Area"
                        aria-describedby={`upload-instruction-${index}`}
                        tabIndex={0}
                        className={`drop-area ${isDragging ? 'dragging' : ''}`}
                        style={{
                          ...classes.attachmentsContainer,
                          border: '2px dashed #ccc',
                          borderTop: 'none',
                          backgroundColor: isDragging ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                          transition: 'all 0.3s ease',
                          padding: '20px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          cursor: 'pointer',
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
                            handleFileUploadQuoteConfirmation(event, item);

                            // Reset the file input value so the same file can be selected again
                            const fileInput = document.getElementById(`file-upload-${index}`) as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = "";
                            }
                          }
                        }}
                      >
                        <p id={`upload-instruction-${index}`} className="sr-only">
                          {t("fileUploader.dragAndDropUpload")}
                        </p>
                      </div>
                    </div>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUploadQuoteConfirmation(e, item)}
                    />

                    <GoMakeDeleteModal
                      modalType={ModalType.DELETE}
                      title={t("sales.quote.deleteAttachment")}
                      yesBtn={t("sales.quote.yesBtn")}
                      openModal={openDeleteModal}
                      onClose={onClickCloseDeleteModal}
                      onClickDelete={() => handleDeleteFileFromItems(selectedAttachment.parentItem.id, selectedAttachment.fileName)}
                    />
                  </div>
                )
              )
            }
            )}
          </div> : <>
            {isLoading ?
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <GomakeLoadingWithShadow style={{ backgroundColor: 'transparent', zIndex: 1 }} />
              </div> : <div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <GomakePrimaryButton
                  onClick={() => document.getElementById('file-upload').click()}
                  style={classes.primaryButtonChooseFile}
                >
                  {t("fileUploader.chooseFile")}
                </GomakePrimaryButton>
                {quoteItemValue?.attachments?.length > 0 && <div style={classes.attachmentsContainer}>
                  <PrimaryTable
                    stickyFirstCol={false}
                    stickyHeader={true}
                    maxHeight={400}
                    rows={getAttachmentsRows()}
                    headers={[t("fileUploader.fileName"), t("fileUploader.downloadFile"), t("fileUploader.deleteFile")]}
                    columnWidths={["70%", "15%", "15%"]}
                  />

                  <GoMakeDeleteModal
                    modalType={ModalType.DELETE}
                    title={t("sales.quote.deleteAttachment")}
                    yesBtn={t("sales.quote.yesBtn")}
                    openModal={openDeleteModal}
                    onClose={onClickCloseDeleteModal}
                    onClickDelete={() => handleDeleteAttachment(selectedAttachment)}
                  />
                </div>}
              </div>
            }</>
        }


      </GoMakeModal>
    </>
  );
};
export { AddAttachmentsModal };