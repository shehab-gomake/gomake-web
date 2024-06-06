import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";

const NewItemNotesModal = ({ openModal, onClose }: {
  openModal: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
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
            {quoteItemValue?.client?.newItemNotes}
          </div>

        </>
      </GoMakeModal>
    </>
  );
};
export { NewItemNotesModal };
