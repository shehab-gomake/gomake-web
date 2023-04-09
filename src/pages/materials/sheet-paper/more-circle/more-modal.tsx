import { GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { Table } from "@/widgets/table/table";
import { useSheetModal } from "./use-sheet-modal";
import { useTranslation } from "react-i18next";

const SheetPageMoreModal = ({ openModal, onCloseModal, sheetSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { headerTable } = useSheetModal({});
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={t("materials.sheetPaper.sizesAndPrices")}
      onClose={onCloseModal}
      insideStyle={clasess.insideStyle}
    >
      <Table tableHeaders={headerTable} tableRows={sheetSizes} />
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
