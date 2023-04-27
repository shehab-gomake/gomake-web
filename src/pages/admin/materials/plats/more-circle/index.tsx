import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateSheetModal } from "../update-sheet-modal";
import { materialPlatsState } from "../store/plat";
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
  const materialPlatsStateValue = useRecoilValue<any>(materialPlatsState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialPlatsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.plat.admin.deletePlat")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.plat.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteSheetByCategoryName}
      />
      {item === materialPlatsStateValue.selectedEditItem && (
        <UpdateSheetModal />
      )}
    </>
  );
};
export { SheetSettingsWidget };
