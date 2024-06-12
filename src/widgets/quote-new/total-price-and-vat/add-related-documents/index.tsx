import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

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
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addRelatedDocument")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.inputsContainer}>
          <GoMakeAutoComplate
            options={documentTypeOptions}
            style={clasess.dropDownListStyle}
            placeholder={t("reports.chooseDocumentType")}
            onChange={(e: any, item: any) => {
              onChangeSelectedDocumentTyp(item)

            }}
          />
          <GomakeTextInput
            style={clasess.textInputStyle}
            placeholder={t("reports.documentNumber")}
            onChange={(e) => onChangetDocumentNumber(e)}
          />
          <div style={clasess.addNewBtnContainer}>
            <GomakePrimaryButton style={clasess.addBtnStyle}>{t('mailingSettings.addNew')}</GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddRelatedDocumentsModal };
