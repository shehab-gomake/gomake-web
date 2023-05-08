import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateTubeModal } from "../update-tubes-modal";
import { materialTubeState } from "../store/tube";
import { useTubeModal } from "./use-tube-modal";
import { IconWidget } from "./icon-widget";

const TubeSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteTubeByCategoryName,
    t,
  } = useTubeModal({
    item,
  });
  const materialTubeStateValue = useRecoilValue<any>(materialTubeState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialTubeStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.tubes.admin.deleteTube")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.tubes.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteTubeByCategoryName}
      />
      {item === materialTubeStateValue.selectedEditItem && <UpdateTubeModal />}
    </>
  );
};
export { TubeSettingsWidget };
