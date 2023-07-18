import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useLaminationModal } from "./use-lamination-modal";
import { UpdateLaminationNewModal } from "../update-lamination-modal";
import { materialLaminationState } from "../store/lamination";
import { DuplicateModal } from "../duplicate-modal";

const LaminationSettingsNewWidget = ({ item }: any) => {
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
        onOpnDuplicateModal={() => {
          materialLaminationStateValue?.onOpnDuplicateModal(item);
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
        subTitle={`${t("materials.modals.subTitleDeleteModal", {
          name: `${item?.categoryName}`,
        })}?`}
        onClickDelete={deleteLaminationByCategoryName}
      />
      {item?.categoryName ===
        materialLaminationStateValue?.selectedEditItem?.categoryName && (
        <>
          <UpdateLaminationNewModal />
          <DuplicateModal />
        </>
      )}
    </>
  );
};
export { LaminationSettingsNewWidget };
