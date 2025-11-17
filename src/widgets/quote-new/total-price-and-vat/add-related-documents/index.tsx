import { GoMakeAutoComplate, GoMakeDialog, GomakePrimaryButton, GomakeTextInput } from "@/components";

import { useaddRelatedDocuments } from "./use-add-related-documents";
import { useStyle } from "./style";

const AddRelatedDocumentsModal = ({ openModal, onClose }: {
  openModal: boolean;
  onClose: () => void;
}) => {
  const { clasess } = useStyle();
  const {
    t,
    onChangeSelectedDocumentTyp,
    onChangetDocumentNumber,
    documentTypeOptions
  } = useaddRelatedDocuments()

  return (
    <GoMakeDialog
      open={openModal}
      onClose={onClose}
      title={t("sales.quote.addRelatedDocumentModal")}
      primaryButtonLabel={t("mailingSettings.addNew")}
      onPrimaryAction={() => { }}
      maxWidth="xs"
      fullWidth={true}
    >
      <div style={clasess.inputsContainer}>
        <GoMakeAutoComplate
          options={documentTypeOptions}
          style={clasess.dropDownListStyle}
          placeholder={t("reports.chooseDocumentType")}
          onChange={(e: any, item: any) => {
            onChangeSelectedDocumentTyp(item);
          }}
        />
        <GomakeTextInput
          style={clasess.textInputStyle}
          placeholder={t("reports.documentNumber")}
          onChange={(e) => onChangetDocumentNumber(e)}
        />
      </div>
    </GoMakeDialog>
  );
};
export { AddRelatedDocumentsModal };
