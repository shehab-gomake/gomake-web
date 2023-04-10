import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { Table } from "@/widgets/table/table";
import { GoMakeModal } from "@/components";
import { ShowSupplierList } from "@/store";

import { useHardboardsModal } from "./use-hardboards-modal";
import { useStyle } from "./style";

const MoreModal = ({ openModal, setOpenModal, hardboardsThicknes }: any) => {
  const { clasess } = useStyle({});
  const { t } = useTranslation();
  const { headerTable } = useHardboardsModal();

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
      modalTitle={t("materials.lamination.modal.thicknesses")}
      onClose={() => setOpenModal(false)}
      insideStyle={clasess.insideStyle}
    >
      <Table tableHeaders={headerTable} tableRows={hardboardsThicknes} />
    </GoMakeModal>
  );
};
export { MoreModal };
