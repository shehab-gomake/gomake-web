import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useVarnishModal } from "./use-varnish-modal";

import { materialVarnishState } from "../store/varnish";
import { UpdateVarnishModal } from "../update-varnish-modal";

const VarnishSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteVarnish,
    t,
  } = useVarnishModal({
    item,
  });
  const materialVarnishStateValue = useRecoilValue<any>(materialVarnishState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialVarnishStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.varnishs.admin.deleteVarnishs")}
        yesBtn={t("materials.magnets.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.varnishs.admin.subTitleDeleteModal", {
          name: `${item?.typeName}`,
        })}?`}
        onClickDelete={deleteVarnish}
      />
      {item === materialVarnishStateValue.selectedEditItem && (
        <UpdateVarnishModal />
      )}
    </>
  );
};
export { VarnishSettingsWidget };
