import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdatePlatModal } from "../update-envelope-modal";
import { materialEnvelopeState } from "../store/plat";
import { usePlatsModal } from "./use-envelope-modal";
import { IconWidget } from "./icon-widget";

const EnvelopsSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deletePlatByCategoryName,
    t,
  } = usePlatsModal({
    item,
  });
  const materialPlatsStateValue = useRecoilValue<any>(materialEnvelopeState);

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
        onClickDelete={deletePlatByCategoryName}
      />
      {item === materialPlatsStateValue.selectedEditItem && <UpdatePlatModal />}
    </>
  );
};
export { EnvelopsSettingsWidget };
