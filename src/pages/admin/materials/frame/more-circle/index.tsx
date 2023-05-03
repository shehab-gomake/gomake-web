import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateFrameModal } from "../update-frame-modal";
import { materialFrameState } from "../store/frame";
import { useFrameModal } from "./use-frame-modal";
import { IconWidget } from "./icon-widget";

const FrameSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteFrameByCategoryName,
    t,
  } = useFrameModal({
    item,
  });
  const materialFrameStateValue = useRecoilValue<any>(materialFrameState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialFrameStateValue?.onOpnUpdateModal(item);
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
        onClickDelete={deleteFrameByCategoryName}
      />
      {item === materialFrameStateValue.selectedEditItem && (
        <UpdateFrameModal />
      )}
    </>
  );
};
export { FrameSettingsWidget };
