import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateProfileFrameModal } from "../update-profile-frame-modal";
import { materialProfileFrameState } from "../store/profile-frame";
import { useProfileFrameModal } from "./use-profile-frame-modal";
import { IconWidget } from "./icon-widget";

const ProfileFrameSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteProfileFrameByCategoryName,
    t,
  } = useProfileFrameModal({
    item,
  });
  const materialProfileFrameStateValue = useRecoilValue<any>(
    materialProfileFrameState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialProfileFrameStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.profileFrames.admin.deleteProfileFrameTitle")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "materials.profileFrames.admin.deleteLProfileFrameSubTitle"
        )} ${item?.categoryName} ?`}
        onClickDelete={deleteProfileFrameByCategoryName}
      />
      {item === materialProfileFrameStateValue.selectedEditItem && (
        <UpdateProfileFrameModal />
      )}
    </>
  );
};
export { ProfileFrameSettingsWidget };
