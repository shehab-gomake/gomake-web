import { GoMakeDeleteModal, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "../style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { ModalType } from "@/enums";
import { useAddAttachmentsPurchaseModal } from "./use-add-attachments-purchase-modal";
import { GomakeLoadingWithShadow } from "@/widgets/loading-with-shadow/loading";


const AddAttachmentsPurchaseModal = ({ openModal, onClose, documentType, getQuote, quoteConfirm }) => {
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
  } = useAddAttachmentsPurchaseModal({ getQuote, documentType, quoteConfirm });

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
        <>

          {isLoading ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <GomakeLoadingWithShadow style={{ backgroundColor: 'transparent', zIndex: 1 }} />
            </div> : <div>
              <input
                type="file"
                onChange={handleFileUpload}
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
          }
        </>

      </GoMakeModal>
    </>
  );
};
export { AddAttachmentsPurchaseModal };



