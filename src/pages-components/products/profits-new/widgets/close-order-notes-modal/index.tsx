import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { useStyle } from "./style";

const CloseOrderNotesModal = ({
  openModal,
  onClose,
  quoteItemValue,
  onClickCloseOrder,
}: {
  openModal: boolean;
  onClose: () => void;
  quoteItemValue: any;
  onClickCloseOrder: any;
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.modals.closeOrderNotes")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <>
          <div style={classes.noteTextStyle}>
            {t("modal.clientClosingMessage")} {quoteItemValue?.closeOrderNotes}
          </div>

          <GomakePrimaryButton
            style={classes.btnThirdContainer}
            onClick={() => {
              onClickCloseOrder();
              onClose();
            }}
          >
            {t("sales.modals.closeOrder")}
          </GomakePrimaryButton>
        </>
      </GoMakeModal>
    </>
  );
};
export { CloseOrderNotesModal };
