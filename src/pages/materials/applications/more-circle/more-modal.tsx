import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { GoMakeModal } from "@/components";
import { ShowSupplierList } from "@/store";

import { useApplicationModal } from "./use-application-modal";
import { useStyle } from "./style";

const SheetPageMoreModal = ({
  openModal,
  onCloseModal,
  applicationThickness,
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
      modalTitle={t("materials.applications.thickness")}
      onClose={onCloseModal}
      insideStyle={clasess.insideStyle}
    >
      <Table tableHeaders={headerTable} tableRows={applicationThickness} />
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
