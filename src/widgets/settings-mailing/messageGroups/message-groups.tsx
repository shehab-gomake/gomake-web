import { useMessageGroups } from "./use-message-groups";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import {
  ActionType,
  AddNewSMSTemplateGroup,
} from "../messageTemplates/components/add-new/add-new";

const MessageGroups = () => {
  const {
    t,
    tableHeaders,
    SMSTemplatesGroups,
    deleteModalState,
    onCloseDeleteModal,
    deleteMessageGroups,
    updateMessageGroups,
    agentsCategories,
    editModalState,
    onCloseEditModal,
    updateGroupState,
    setUpdateGroupState,
  } = useMessageGroups();

  return (
    <div style={{ position: "relative" }}>
      <PrimaryTable
        stickyHeader={true}
        rows={SMSTemplatesGroups}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 280px)"}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        title={t("mailingSettings.deleteGroup")}
        subTitle={""}
        yesBtn={t("sales.quote.Confirm")}
        openModal={deleteModalState}
        onClose={onCloseDeleteModal}
        onClickDelete={deleteMessageGroups}
        onClickCancel={onCloseDeleteModal}
        style={{ width: "30%", minWidth: "400px" }}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        subTitle={" "}
        openModal={editModalState}
        title={t("mailingSettings.editGroup")}
        onClose={onCloseEditModal}
        onClickDelete={updateMessageGroups}
        style={{ width: "30%", minWidth: "400px" }}
      >
        <AddNewSMSTemplateGroup
          agentsCategories={agentsCategories}
          actionType={ActionType.EDIT}
          state={updateGroupState}
          setState={setUpdateGroupState}
        />
      </GoMakeDeleteModal>
    </div>
  );
};

export { MessageGroups };
