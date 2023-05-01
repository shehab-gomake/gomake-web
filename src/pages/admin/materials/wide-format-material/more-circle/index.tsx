import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useSheetModal } from "./use-wide-format-material-modal";
import { UpdateSheetModal } from "../update-wide-format-material-modal";
import { materialSheetsState } from "../store/sheets";

const WideFormatMaterialSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetByCategoryName,
    t,
  } = useSheetModal({
    item,
  });
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialSheetsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.sheetPaper.admin.deleteSheet")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.sheetPaper.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteSheetByCategoryName}
      />
      {item === materialSheetsStateValue.selectedEditItem && (
        <UpdateSheetModal />
      )}
    </>
  );
};
export { WideFormatMaterialSettingsWidget };
