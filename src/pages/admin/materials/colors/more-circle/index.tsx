import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useMagnetModal } from "./use-magnet-modal";

import { materialColorState } from "../store/colors";
import { UpdateMagnetModal } from "../update-color-modal";

const ColorSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteMagnet,
    t,
  } = useMagnetModal({
    item,
  });
  const materialMagnetStateValue = useRecoilValue<any>(materialColorState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialMagnetStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.magnets.admin.deleteMagnet")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.modals.subTitleDeleteModal", {
          name: `${item?.name}`,
        })}?`}
        onClickDelete={deleteMagnet}
      />
      {item === materialMagnetStateValue.selectedEditItem && (
        <UpdateMagnetModal />
      )}
    </>
  );
};
export { ColorSettingsWidget };
