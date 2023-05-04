import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateSheetEncapsulationModal } from "../update-sheet-encapsulation-modal";
import { materialSheetEncapsulationState } from "../store/sheet-encapsulation";
import { useSheetEncapsulationModal } from "./use-sheet-encapsulation-modal";
import { IconWidget } from "./icon-widget";

const SheetEncapsulationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetEncapsulationByCategoryName,
    t,
  } = useSheetEncapsulationModal({
    item,
  });
  const materialSheetEncapsulationStateValue = useRecoilValue<any>(
    materialSheetEncapsulationState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialSheetEncapsulationStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.sheetEncapsulation.admin.deleteSheetEncapsulation")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "materials.sheetEncapsulation.admin.subTitleDeleteModal"
        )} ${item?.categoryName} ?`}
        onClickDelete={deleteSheetEncapsulationByCategoryName}
      />
      {item === materialSheetEncapsulationStateValue.selectedEditItem && (
        <UpdateSheetEncapsulationModal />
      )}
    </>
  );
};
export { SheetEncapsulationSettingsWidget };
