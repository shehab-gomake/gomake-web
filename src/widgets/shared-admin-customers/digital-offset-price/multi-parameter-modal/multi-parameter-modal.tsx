import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const MultiParameterModal = ({ openModal, onClose, modalTitle }) => {
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
        withClose={false}
      >
        <div style={clasess.mainContainer}>
          <div style={clasess.titleStyle}>Color Settings</div>
          <div></div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { MultiParameterModal };
