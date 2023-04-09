import { GoMakeModal } from "@/components";

import { useStyle } from "./style";
import { Table } from "@/widgets/table/table";
import { useSheetModal } from "./use-sheet-modal";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { ShowSupplierList } from "@/store";
import { useEffect } from "react";

const SheetPageMoreModal = ({ openModal, onCloseModal, sheetSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { headerTable } = useSheetModal({});
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  useEffect(() => {
    setShowUnderRowWidget({
      stateShow: false,
      widget: {},
      item: {},
      key: "",
    });
  }, [openModal]);
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
