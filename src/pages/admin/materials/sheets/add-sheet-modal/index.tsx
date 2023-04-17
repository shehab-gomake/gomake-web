import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";

const AddSheetModal = ({ openModal, onCloseModal, onOpnModalAdded }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("materials.sheetPaper.admin.addNewSheet")}
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div>gg</div>
        <div>gg</div>
      </GoMakeModal>
    </>
  );
};
export { AddSheetModal };
