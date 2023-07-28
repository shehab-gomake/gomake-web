import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import moreCircle from "@/icons/more-circle.png";
import { useSheetModal } from "./use-sheet-modal";
import { UpdateSheetModal } from "../update-sheet-modal";
import { materialSheetsState } from "../store/sheets";
import { GoMakeDeleteMaterialModal } from "@/widgets";
import { DuplicateModal } from "../duplicate-modal";

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
        onOpnDuplicateModal={() => {
          materialSheetsStateValue?.onOpnDuplicateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.sheetPaper.admin.deleteSheet")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.modals.subTitleDeleteModal", {
          name: `${item?.categoryName}`,
        })}?`}
        onClickDelete={async () => {
          await deleteSheetByCategoryName();
          await materialSheetsStateValue?.getSheets();
        }}
      />
      {item?.categoryName ===
        materialSheetsStateValue?.selectedEditItem?.categoryName && (
        <>
          <UpdateSheetModal />
          <DuplicateModal />
        </>
      )}
    </>
  );
};
export { SheetSettingsWidget };
