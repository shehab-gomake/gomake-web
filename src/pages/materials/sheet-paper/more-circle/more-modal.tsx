import { GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { Table } from "@/widgets/table/table";
import { useSheetModal } from "./use-sheet-modal";

const SheetPageMoreModal = ({ openModal, setOpenModal, sheetSizes }: any) => {
  const { clasess } = useStyle();
  const { headerTable } = useSheetModal({});
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Sizes and Prices"
      onClose={() => setOpenModal(false)}
      insideStyle={clasess.insideStyle}
    >
      <Table tableHeaders={headerTable} tableRows={sheetSizes} />
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
