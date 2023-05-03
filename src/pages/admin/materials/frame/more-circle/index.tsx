import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePlatModal } from "../update-frame-modal";
import { materialPlatsState } from "../store/frame";
import { usePlatsModal } from "./use-frame-modal";
import { IconWidget } from "./icon-widget";

const FrameSettingsWidget = ({ item }: any) => {
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
        title={t("materials.frames.admin.deleteFrame")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.frames.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deletePlatByCategoryName}
      />
      {item === materialPlatsStateValue.selectedEditItem && <UpdatePlatModal />}
    </>
  );
};
export { FrameSettingsWidget };
