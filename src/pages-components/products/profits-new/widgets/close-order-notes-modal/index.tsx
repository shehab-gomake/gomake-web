import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const CloseOrderNotesModal = ({ openModal, onClose, quoteItemValue }: {
  openModal: boolean;
  onClose: () => void;
  quoteItemValue: any
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
            {quoteItemValue?.closeOrderNotes}
          </div>

        </>
      </GoMakeModal>
    </>
  );
};
export { CloseOrderNotesModal };
