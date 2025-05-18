import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";

//!here close modal
const CloseOrderNotesModal = ({
  openModal,
  onClose,
  quoteItemValue,
  onClickCloseOrder,
}: {
  openModal: boolean;
  onClose: () => void;
  quoteItemValue: any;
  onClickCloseOrder?: any;
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={`Close Order Notes`}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <>
          <div style={clasess.noteTextStyle}>
            {t("modal.clientClosingMessage")} {quoteItemValue?.closeOrderNotes}
          </div>

          <GomakePrimaryButton
            style={clasess.btnThirdContainer}
            onClick={() => {
              onClickCloseOrder();
              onClose();
            }}
          >
            {t("modal.close")} {t("sales.quote.order")}
          </GomakePrimaryButton>
        </>
      </GoMakeModal>
    </>
  );
};
export { CloseOrderNotesModal };
