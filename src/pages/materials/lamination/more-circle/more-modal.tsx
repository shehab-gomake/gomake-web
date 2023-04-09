import { useTranslation } from "react-i18next";

import { GoMakeModal } from "@/components";
import { Table } from "@/widgets/table/table";
import { useStyle } from "./style";
import { useLaminationModal } from "./use-lamination-modal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { ShowSupplierList } from "@/store";

const MoreModal = ({ openModal, setOpenModal, laminatioThicknes }: any) => {
  const { clasess } = useStyle({});
  const { t } = useTranslation();
  const { headerTable } = useLaminationModal();

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
      <Table tableHeaders={headerTable} tableRows={laminatioThicknes} />
    </GoMakeModal>
  );
};
export { MoreModal };
