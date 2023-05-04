import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useApplicationModal } from "./use-application-modal";
import { UpdatalAdditionModal } from "../update-addition-modal";
import { materialAdditionsState } from "../store/additions";

const AdditionSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteAdditionByCode,
    t,
  } = useApplicationModal({
    item,
  });
  const materialAdditionsStateValue = useRecoilValue<any>(
    materialAdditionsState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialAdditionsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.additions.admin.deleteAddition")}
        yesBtn={t("materials.additions.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.additions.admin.subTitleDeleteModal")} ${
          item?.name
        } ?`}
        onClickDelete={deleteAdditionByCode}
      />
      {item === materialAdditionsStateValue.selectedEditItem && (
        <UpdatalAdditionModal />
      )}
    </>
  );
};
export { AdditionSettingsWidget };
