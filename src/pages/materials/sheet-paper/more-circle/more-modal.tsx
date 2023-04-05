import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const SheetPageMoreModal = ({ openModal, setOpenModal, data }: any) => {
  const { clasess } = useStyle();
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Test"
      onClose={() => setOpenModal(false)}
      insideStyle={clasess.insideStyle}
    >
      <div>{data?.weightId}</div>
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
