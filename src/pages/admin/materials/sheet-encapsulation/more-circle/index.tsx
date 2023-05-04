import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePlatModal } from "../update-sheet-encapsulation-modal";
import { materialPlatsState } from "../store/sheet-encapsulation";
import { usePlatsModal } from "./use-sheet-encapsulation-modal";
import { IconWidget } from "./icon-widget";

const SheetEncapsulationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePlatByCategoryName,
    t,
  } = usePlatsModal({
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
        title={t("materials.sheetEncapsulation.admin.deleteSheetEncapsulation")}
        yesBtn={t("materials.sheetPaper.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t(
          "materials.sheetEncapsulation.admin.subTitleDeleteModal"
        )} ${item?.categoryName} ?`}
        onClickDelete={deletePlatByCategoryName}
      />
      {item === materialPlatsStateValue.selectedEditItem && <UpdatePlatModal />}
    </>
  );
};
export { SheetEncapsulationSettingsWidget };
