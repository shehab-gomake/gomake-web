import { useTranslation } from "react-i18next";
import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const ChooseShapeModal = ({ openModal, onClose, modalTitle }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div>fff</div>
      </GoMakeModal>
    </>
  );
};
export { ChooseShapeModal };
