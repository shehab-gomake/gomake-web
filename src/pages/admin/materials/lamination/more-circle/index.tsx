import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import moreCircle from "@/icons/more-circle.png";
import { IconButton, Tooltip } from "@mui/material";
import { useSheetModal } from "./use-sheet-modal";
import { UpdateSheetModal } from "../update-sheet-modal";
import { materialLaminationsState } from "../store/lamination";
import { GoMakeDeleteMaterialModal } from "@/widgets";

const LaminationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetByCategoryName,
    t,
  } = useSheetModal({
    item,
  });
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialLaminationsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.lamination.admin.deleteLamination")}
        yesBtn={t("materials.lamination.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.lamination.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteSheetByCategoryName}
      />
      {item === materialLaminationsStateValue.selectedEditItem && (
        <UpdateSheetModal />
      )}
    </>
  );
};
export { LaminationSettingsWidget };
