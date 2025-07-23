import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { useClientGroupsList } from "./use-client-groups-list";
import { ClientGroupModal } from "./components/add-edit-client-group-modal";
import { useEffect } from "react";

const ClientGroupsList = () => {
  const { classes } = useStyle();
  const {
    t,
    rows,
    tableHeaders,
    openModal,
    selectedClientGroupId,
    handleDelete,
    openDeleteModal,
    selectedGroupId,
    onCloseDeleteModal,
    onCloseAddEditModal,
    getClientsGroups,
  } = useClientGroupsList();

  useEffect(() => {
    getClientsGroups();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        maxHeight={"calc(100vh - 300px)"}
        rows={rows}
        headers={tableHeaders}
      />
      {openModal && selectedClientGroupId && (
        <ClientGroupModal
          openModal={openModal}
          onClose={onCloseAddEditModal}
          modalTitle={t("customers.editGroup")}
          selectedClientGroupId={selectedClientGroupId}
          actionType="edit"
        />
      )}
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        yesBtn={t("products.profits.delete")}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        onClickDelete={() => handleDelete(selectedGroupId)}
      />
    </div>
  );
};

export { ClientGroupsList };
