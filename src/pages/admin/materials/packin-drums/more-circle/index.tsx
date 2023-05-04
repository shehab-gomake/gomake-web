import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePlatModal } from "../update-packin-drum-modal";
import { materialPlatsState } from "../store/packin-drum";
import { usePlatsModal } from "./use-packin-drum-modal";
import { IconWidget } from "./icon-widget";

const PackinDrumSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePlatByCategoryName,
    t,
  } = usePlatsModal({
    item,
  });
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialPlatsStateValue?.onOpnUpdateModal(item);
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
        onClickDelete={deletePlatByCategoryName}
      />
      {item === materialPlatsStateValue.selectedEditItem && <UpdatePlatModal />}
    </>
  );
};
export { PackinDrumSettingsWidget };
