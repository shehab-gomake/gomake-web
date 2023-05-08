import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateFoilModal } from "../update-foil-modal";
import { materialFoilState } from "../store/foil";
import { useFoilModal } from "./use-foil-modal";
import { IconWidget } from "./icon-widget";

const FoilSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteFoilByCategoryName,
    t,
  } = useFoilModal({
    item,
  });
  const materialFoilStateValue = useRecoilValue<any>(materialFoilState);

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialFoilStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.foils.admin.deleteFoil")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.foils.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteFoilByCategoryName}
      />
      {item === materialFoilStateValue.selectedEditItem && <UpdateFoilModal />}
    </>
  );
};
export { FoilSettingsWidget };
