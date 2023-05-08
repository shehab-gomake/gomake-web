import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePackinUnit } from "../update-packin-unit-modal";
import { materialPackinUnitsState } from "../store/packin-units";
import { usePackinUnitModal } from "./use-packin-unit";
import { IconWidget } from "./icon-widget";

const PackinUnitSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePackinUnitByCategoryName,
    t,
  } = usePackinUnitModal({
    item,
  });
  const materialPackinUnitsStateValue = useRecoilValue<any>(
    materialPackinUnitsState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialPackinUnitsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.packinUnits.admin.deletePackinUnit")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.packinUnits.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deletePackinUnitByCategoryName}
      />
      {item === materialPackinUnitsStateValue.selectedEditItem && (
        <UpdatePackinUnit />
      )}
    </>
  );
};
export { PackinUnitSettingsWidget };
