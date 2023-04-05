import { useTranslation } from "react-i18next";

import { GoMakeModal } from "@/components";
import { Table } from "@/widgets/table/table";

const MoreModal = ({ openModal, setOpenModal, laminatioThicknes }: any) => {
  const { t } = useTranslation();

  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle={t("materials.lamination.modal.thicknesses")}
      onClose={() => setOpenModal(false)}
      insideStyle={{ width: "70%" }}
    >
      <Table
        tableHeaders={[
          t("materials.lamination.modal.code"),
          t("materials.lamination.modal.thickness"),
          t("materials.lamination.modal.cold/hot"),
          t("materials.lamination.modal.price"),
          t("materials.lamination.modal.stock"),
        ]}
        tableRows={laminatioThicknes}
      />
    </GoMakeModal>
  );
};
export { MoreModal };
