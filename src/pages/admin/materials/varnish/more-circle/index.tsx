import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useMagnetModal } from "./use-varnish-modal";

import { materialMagnetState } from "../store/varnish";
import { UpdateMagnetModal } from "../update-varnish-modal";

const VarnishSettingsWidget = ({ item }: any) => {
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
        yesBtn={t("materials.magnets.admin.delete")}
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
export { VarnishSettingsWidget };
