import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateMaterialRollPrintingModal } from "../update-material-roll-printing-modal";
import { materialMaterialRollPrintingState } from "../store/material-roll-printing";
import { useMaterialRollPrintingsModal } from "./use-material-roll-printing-modal";
import { IconWidget } from "./icon-widget";

const MaterialRollPrintingSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteMaterialRollPrintingByCategoryName,
    t,
  } = useMaterialRollPrintingsModal({
    item,
  });
  const materialMaterialRollPrintingsStateValue = useRecoilValue<any>(
    materialMaterialRollPrintingState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialMaterialRollPrintingsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.printingMaterials.admin.deletePrintingMaterials")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "materials.printingMaterials.admin.subTitleDeleteModal"
        )} ${item?.categoryName} ?`}
        onClickDelete={deleteMaterialRollPrintingByCategoryName}
      />
      {item === materialMaterialRollPrintingsStateValue.selectedEditItem && (
        <UpdateMaterialRollPrintingModal />
      )}
    </>
  );
};
export { MaterialRollPrintingSettingsWidget };
