import { GoMakeAutoComplate, GoMakeDialog, GomakeTextInput } from "@/components";

import { useAddRelatedDocuments } from "./use-add-related-documents";
import { useStyle } from "./style";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface AddRelatedDocumentsModalProps {
  openModal: boolean;
  onClose: () => void;
  documentId?: string;
  onSuccess?: () => void;
  docType?: DOCUMENT_TYPE;
}

const AddRelatedDocumentsModal = ({
  openModal,
  onClose,
  documentId,
  onSuccess,
  docType
}: AddRelatedDocumentsModalProps) => {
  const { clasess } = useStyle();
  const {
    t,
    documentTypeOptions,
    documentNumber,
    selectedDocumentType,
    isSubmitting,
    isPrimaryDisabled,
    handleSelectDocumentType,
    handleDocumentNumberChange,
    handleSubmit,
    resetForm,
  } = useAddRelatedDocuments({
    documentId,
    onSuccess,
    onClose,
    docType,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <GoMakeDialog
      open={openModal}
      onClose={handleClose}
      title={t("sales.quote.addRelatedDocumentModal")}
      primaryButtonLabel={t("mailingSettings.addNew")}
      onPrimaryAction={handleSubmit}
      primaryButtonDisabled={isPrimaryDisabled}
      primaryButtonLoading={isSubmitting}
      maxWidth="xs"
      fullWidth={true}
    >
      <div style={clasess.inputsContainer}>
        <GoMakeAutoComplate
          options={documentTypeOptions}
          style={clasess.dropDownListStyle}
          placeholder={t("reports.chooseDocumentType")}
          value={selectedDocumentType}
          onChange={(e: any, item: any) => {
            handleSelectDocumentType(item);
          }}
        />
        <GomakeTextInput
          style={clasess.textInputStyle}
          placeholder={t("reports.documentNumber")}
          value={documentNumber}
          onChange={handleDocumentNumberChange}
        />
      </div>
    </GoMakeDialog>
  );
};
export { AddRelatedDocumentsModal };
