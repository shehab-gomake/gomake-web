import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useGluesModal } from "./use-glue-modal";

import { materialGluesState } from "../store/glues";
import { UpdateGluesModal } from "../update-glue-modal";

const GlueSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteMagnet,
    t,
  } = useGluesModal({
    item,
  });
  const materialMagnetStateValue = useRecoilValue<any>(materialGluesState);

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
        <UpdateGluesModal />
      )}
    </>
  );
};
export { GlueSettingsWidget };
