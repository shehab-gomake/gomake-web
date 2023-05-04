import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePackinDrumModal } from "../update-packin-drum-modal";
import { materialPackinDrumState } from "../store/packin-drum";
import { usePackinDrumModal } from "./use-packin-drum-modal";
import { IconWidget } from "./icon-widget";

const PackinDrumSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePackinDrumByCategoryName,
    t,
  } = usePackinDrumModal({
    item,
  });
  const materialPackinDrumStateValue = useRecoilValue<any>(
    materialPackinDrumState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialPackinDrumStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.packinDrums.admin.deletePackinDrum")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.packinDrums.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deletePackinDrumByCategoryName}
      />
      {item === materialPackinDrumStateValue.selectedEditItem && (
        <UpdatePackinDrumModal />
      )}
    </>
  );
};
export { PackinDrumSettingsWidget };
