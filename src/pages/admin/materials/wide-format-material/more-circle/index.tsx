import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useWideFormatMaterialModal } from "./use-wide-format-material-modal";
import { UpdateWideFormatMaterialModal } from "../update-wide-format-material-modal";
import { materialWideFormatMaterialState } from "../store/wide-format-material";

const WideFormatMaterialSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteWideFormatMaterialByCategoryName,
    t,
  } = useWideFormatMaterialModal({
    item,
  });
  const materialWideFormatMaterialStateValue = useRecoilValue<any>(
    materialWideFormatMaterialState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialWideFormatMaterialStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.sheetPaper.admin.deleteWideFormatMaterial")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.sheetPaper.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteWideFormatMaterialByCategoryName}
      />
      {item === materialWideFormatMaterialStateValue.selectedEditItem && (
        <UpdateWideFormatMaterialModal />
      )}
    </>
  );
};
export { WideFormatMaterialSettingsWidget };
