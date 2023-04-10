import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { Table } from "@/widgets/table/table";
import { GoMakeModal } from "@/components";
import { ShowSupplierList } from "@/store";

import { useWildPrintingMatieralsModal } from "./use-wild-printing-material-modal";
import { useStyle } from "./style";

const SheetPageMoreModal = ({ openModal, onCloseModal, sheetSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { headerTable } = useWildPrintingMatieralsModal({});
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
