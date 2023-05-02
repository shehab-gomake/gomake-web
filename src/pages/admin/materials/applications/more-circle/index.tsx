import { useRecoilValue } from "recoil";

import { GoMakeDeleteModal } from "@/components";
import { IconWidget } from "./icon-widget";
import { useApplicationModal } from "./use-application-modal";
import { UpdatalApplicationModal } from "../update-hardboard-modal";
import { materialApplicationsState } from "../store/applications";

const ApplicationSettingsWidget = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteHardboardByCategoryName,
    t,
  } = useApplicationModal({
    item,
  });
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <IconWidget
        t={t}
        onOpnUpdateModal={() => {
          materialApplicationsStateValue?.onOpnUpdateModal(item);
        }}
        onOpenDeleteModal={onOpenDeleteModal}
      />
      <GoMakeDeleteModal
        hideIcon={true}
        title={t("materials.applications.admin.deleteApplication")}
        yesBtn={t("materials.applications.admin.delete")}
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`${t("materials.applications.admin.subTitleDeleteModal")} ${
          item?.categoryName
        } ?`}
        onClickDelete={deleteHardboardByCategoryName}
      />
      {item === materialApplicationsStateValue.selectedEditItem && (
        <UpdatalApplicationModal />
      )}
    </>
  );
};
export { ApplicationSettingsWidget };
