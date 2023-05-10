import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useSheetModal } from "./use-hardboard-modal";
import { UpdatalHardboardModal } from "../update-hardboard-modal";
import { materialHardboardsState } from "../store/hardboards";

const HardboardSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteHardboardByCategoryName,
    t,
  } = useSheetModal({
    item,
  });
  const materialHardboardssStateValue = useRecoilValue<any>(
    materialHardboardsState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialHardboardssStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.hardboards.admin.deleteHardboard")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.modals.subTitleDeleteModal", {
          name: `${item?.categoryName}`,
        })}?`}
        onClickDelete={deleteHardboardByCategoryName}
      />
      {item === materialHardboardssStateValue.selectedEditItem && (
        <UpdatalHardboardModal />
      )}
    </>
  );
};
export { HardboardSettingsWidget };
