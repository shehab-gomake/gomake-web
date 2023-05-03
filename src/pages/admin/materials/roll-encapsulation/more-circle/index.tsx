import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";

import { useRollEncapsulationModal } from "./use-roll-encapsulation-modal";
import { UpdateRollEncapsulationModal } from "../update-roll-encapsulation-modal";
import { materialRollEncapsulationState } from "../store/roll-encapsulation";

const RollEncapsulationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteRollEncapsulationByCategoryName,
    t,
  } = useRollEncapsulationModal({
    item,
  });
  const materialRollEncapsulationStateValue = useRecoilValue<any>(
    materialRollEncapsulationState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialRollEncapsulationStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.sheetPaper.admin.deleteRollEncapsulation")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.sheetPaper.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteRollEncapsulationByCategoryName}
      />
      {item === materialRollEncapsulationStateValue.selectedEditItem && (
        <UpdateRollEncapsulationModal />
      )}
    </>
  );
};
export { RollEncapsulationSettingsWidget };
