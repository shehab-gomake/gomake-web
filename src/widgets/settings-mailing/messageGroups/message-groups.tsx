import { useMessageGroups } from "./use-message-groups";
import { useEffect } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useStyle } from "./style";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";

interface IGroupsProps {
  getSMSTemplateGroups: () => void;
}
const MessageGroups = ({ getSMSTemplateGroups }: IGroupsProps) => {
  const {
    t,
    tableHeaders,
    SMSTemplatesGroups,
    deleteModalState,
    onCloseDeleteModal,
    deleteMessageGroups,
  } = useMessageGroups(getSMSTemplateGroups);

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
      />
    </div>
  );
};

export { MessageGroups };
