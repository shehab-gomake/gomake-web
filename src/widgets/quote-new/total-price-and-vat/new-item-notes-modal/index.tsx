import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const NewItemNotesModal = ({ openModal, onClose, handleSaveBtnClickForDocument, documentType }: {
  openModal: boolean;
  onClose: () => void;
  handleSaveBtnClickForDocument?: any;
  documentType?: any
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const getFormattedDocumentPath = (docType: DOCUMENT_TYPE): string => {
    const documentPath = DOCUMENT_TYPE[docType];
    return documentPath.charAt(0).toUpperCase() + documentPath.slice(1);
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={`${t("modal.notesClient")} "${quoteItemValue?.client?.name}"`}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <>

          <div style={clasess.noteTextStyle}>

            {documentType === DOCUMENT_TYPE.invoice ? quoteItemValue?.client?.closeOrderNotes : quoteItemValue?.client?.newItemNotes}
          </div>

          {
            documentType === DOCUMENT_TYPE.invoice &&
            <GomakePrimaryButton
              style={clasess.btnThirdContainer}
              onClick={() => {
                handleSaveBtnClickForDocument()
                onClose()
              }}
            >
              {t(`sales.quote.create${getFormattedDocumentPath(documentType)}`)}
            </GomakePrimaryButton>
          }

        </>
      </GoMakeModal>
    </>
  );
};
export { NewItemNotesModal };
