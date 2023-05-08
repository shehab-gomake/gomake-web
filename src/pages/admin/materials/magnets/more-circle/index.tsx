import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useMagnetModal } from "./use-magnet-modal";

import { materialMagnetState } from "../store/magnets";
import { UpdateMagnetModal } from "../update-magnet-modal";

const MagnetSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteMagnet,
    t,
  } = useMagnetModal({
    item,
  });
  const materialMagnetStateValue = useRecoilValue<any>(materialMagnetState);

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
        subTitle={`${t("materials.magnets.admin.subTitleDeleteModal", {
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
export { MagnetSettingsWidget };
