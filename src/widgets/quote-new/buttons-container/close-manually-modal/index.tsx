import { useTranslation } from "react-i18next";
import { GoMakeDeleteModal, GomakeTextInput } from "@/components";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { ModalType } from "@/enums";

const ManuallyCloseModal = ({
  documentType,
  openModal,
  onClose,
  onChange,
  onClickYes,
  selectedDocumentId,
  documentCloseNumber,
}) => {
  const { t } = useTranslation();

  return (
    <GoMakeDeleteModal
      modalType={ModalType.WARNING}
      title={t("sales.quote.titleCloseModal")}
      yesBtn={t("sales.quote.yesBtn")}
      openModal={openModal}
      onClose={onClose}
      subTitle={`${t("sales.quote.subTitleCloseModal", {
        documentName: t(
          `sales.quote.${DOCUMENT_TYPE[documentType]}`
        ).toLowerCase(),
      })}?`}
      onClickDelete={() => onClickYes(selectedDocumentId)}
      style={{ width: "35%" }}
    >
      <GomakeTextInput
        style={{ height: "40px", minWidth: 180 }}
        placeholder={t("sales.enterDocumentNumber")}
        value={documentCloseNumber}
        onChange={onChange}
      />
    </GoMakeDeleteModal>
  );
};

export { ManuallyCloseModal };
