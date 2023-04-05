import { GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { useSheetModal } from "./use-sheet-modal";

const SheetPageMoreModal = ({ openModal, setOpenModal, data }: any) => {
  const { clasess } = useStyle();
  const {} = useSheetModal({ data });
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Sizes and Prices"
      onClose={() => setOpenModal(false)}
      insideStyle={clasess.insideStyle}
    >
      <div>{data?.weightId}</div>
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
