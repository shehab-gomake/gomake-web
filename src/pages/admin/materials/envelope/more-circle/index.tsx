import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";

import { UpdateEnvelopeModal } from "../update-envelope-modal";
import { materialEnvelopeState } from "../store/envelope";
import { useEnvelopesModal } from "./use-envelope-modal";
import { IconWidget } from "./icon-widget";

const EnvelopsSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteEnvelopeByCategoryName,
    t,
  } = useEnvelopesModal({
    item,
  });
  const materialEnvelopesStateValue = useRecoilValue<any>(
    materialEnvelopeState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialEnvelopesStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.envelops.admin.deleteEnvelope")}
        yesBtn={t("materials.buttons.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.envelops.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteEnvelopeByCategoryName}
      />
      {item === materialEnvelopesStateValue.selectedEditItem && (
        <UpdateEnvelopeModal />
      )}
    </>
  );
};
export { EnvelopsSettingsWidget };
