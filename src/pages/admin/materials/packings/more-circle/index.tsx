import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePacking } from "../update-packin-unit-modal";
import { materialPackingsState } from "../store/packings";
import { usePackinUnitModal } from "./use-packin-unit";
import { IconWidget } from "./icon-widget";

const PackingSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePackingByCategoryName,
    t,
  } = usePackinUnitModal({
    item,
  });
  const materialPackingsStateValue = useRecoilValue<any>(materialPackingsState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialPackingsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.packings.admin.deletePacking")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.modals.subTitleDeleteModal", {
          name: `${item?.categoryName}`,
        })}?`}
        onClickDelete={deletePackingByCategoryName}
      />
      {item === materialPackingsStateValue.selectedEditItem && (
        <UpdatePacking />
      )}
    </>
  );
};
export { PackingSettingsWidget };
