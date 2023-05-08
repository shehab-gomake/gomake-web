import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useLaminationModal } from "./use-lamination-modal";
import { UpdateLaminationModal } from "../update-lamination-modal";
import { materialLaminationState } from "../store/lamination";

const LaminationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteLaminationByCategoryName,
    t,
  } = useLaminationModal({
    item,
  });
  const materialLaminationStateValue = useRecoilValue<any>(
    materialLaminationState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialLaminationStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.lamination.admin.deleteLamination")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.lamination.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteLaminationByCategoryName}
      />
      {item === materialLaminationStateValue.selectedEditItem && (
        <UpdateLaminationModal />
      )}
    </>
  );
};
export { LaminationSettingsWidget };
