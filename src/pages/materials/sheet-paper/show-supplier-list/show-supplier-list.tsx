import { GoMakeModal } from "@/components";

import { useStyle } from "./style";

const ShowSupplierListForSheetModal = ({ openModal, setOpenModal }: any) => {
  const { clasess } = useStyle();
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Sizes and Prices"
      onClose={() => setOpenModal(false)}
      insideStyle={clasess.insideStyle}
    >
      fff
    </GoMakeModal>
  );
};
export { ShowSupplierListForSheetModal };
