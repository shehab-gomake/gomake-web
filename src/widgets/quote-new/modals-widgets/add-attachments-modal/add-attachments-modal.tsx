import { GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { ModalType } from "@/enums";
import { useAddAttachmentsModal } from "./use-add-attachments-modal";
import { GomakeLoadingWithShadow } from "@/widgets/loading-with-shadow/loading";

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
    getAttachmentsRowsQuoteConfirmation
  } = useAddAttachmentsModal({ getQuote, documentType });

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
            {quoteConfirm?.documentItems?.map((item: any, index: number) => (
              !item.isChecked && (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '10px' }}>{item.productName}</h3>
                  <input
                    type="file"
                    onChange={(e) => handleFileUploadQuoteConfirmation(e, item)}
                    accept="*/*"
                    style={{ display: 'none' }}
                    id={`file-upload-${index}`}
                  />
                  <GomakePrimaryButton
                    onClick={() => document.getElementById(`file-upload-${index}`).click()}
                    style={classes.primaryButtonChooseFile}
                  >
                    {t("fileUploader.chooseFile")}
                  </GomakePrimaryButton>
                  {(
                    <div style={classes.attachmentsContainer}>
                      <PrimaryTable
                        stickyFirstCol={false}
                        stickyHeader={true}
                        maxHeight={400}
                        rows={getAttachmentsRowsQuoteConfirmation(item)}
                        headers={[t("fileUploader.fileName"), t("fileUploader.openFile"), t("fileUploader.deleteFile")]}
                        columnWidths={["70%", "15%", "15%"]}
                      />
                      <GoMakeDeleteModal
                        modalType={ModalType.DELETE}
                        title={t("sales.quote.deleteAttachment")}
                        yesBtn={t("sales.quote.yesBtn")}
                        openModal={openDeleteModal}
                        onClose={onClickCloseDeleteModal}
                      // onClickDelete={() => handleDeleteAttachment(selectedAttachment, item.id)}
                      />
                    </div>
                  )}
                </div>
              )
            ))}
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
                    headers={[t("fileUploader.fileName"), t("fileUploader.openFile"), t("fileUploader.deleteFile")]}
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