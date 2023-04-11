import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { Table } from "@/widgets/table/table";
import { GoMakeModal } from "@/components";
import { ShowSupplierList } from "@/store";

import { useApplicationModal } from "./use-encapsulation-roll-modal";
import { useStyle } from "./style";

const SheetPageMoreModal = ({
  openModal,
  onCloseModal,
  encapsulationRollSizes,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { headerTable } = useApplicationModal({});
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
      modalTitle={t("materials.encapsulationRoll.thickness")}
      onClose={onCloseModal}
      insideStyle={clasess.insideStyle}
    >
      <Table tableHeaders={headerTable} tableRows={encapsulationRollSizes} />
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
