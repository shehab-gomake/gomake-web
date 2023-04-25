import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateSheetModal } from "../update-sheet-modal";
import { materialSheetsState } from "../store/sheets";
import { useSheetModal } from "./use-sheet-modal";
import { IconWidget } from "./icon-widget";

const SheetSettingsWidget = ({ item }: any) => {
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
        title={t("materials.sheetPaper.admin.deleteSheet")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
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
export { SheetSettingsWidget };
