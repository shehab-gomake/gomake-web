import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePlatModal } from "../update-canvas-frame-modal";
import { materialCanvasFramesState } from "../store/canvas-frames";
import { usePlatsModal } from "./use-plat-modal";
import { IconWidget } from "./icon-widget";

const GanvasFramesSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteCanvasFrameByCategoryName,
    t,
  } = usePlatsModal({
    item,
  });
  const materialCanvasFramesStateValue = useRecoilValue<any>(
    materialCanvasFramesState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialCanvasFramesStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.canvasFrames.admin.deleteCanvasFrame")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.canvasFrames.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteCanvasFrameByCategoryName}
      />
      {item === materialCanvasFramesStateValue.selectedEditItem && (
        <UpdatePlatModal />
      )}
    </>
  );
};
export { GanvasFramesSettingsWidget };
