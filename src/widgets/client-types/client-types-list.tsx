import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useClientTypesList } from "./use-client-types-list";
import { ClientTypeModal } from "./components/add-edit-client-type-modal";

interface ClientTypesListProps {
  clientType: CLIENT_TYPE;
}

const ClientTypesList = ({ clientType }: ClientTypesListProps) => {
  const { classes } = useStyle();
  const {
    rows,
    tableHeaders,
    openModal,
    setOpenModal,
    selectedClientTypeId,
    cardTypeId,
  } = useClientTypesList(clientType);

  return (
    <div style={classes.mainContainer}>
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={true}
        maxHeight={"calc(100vh - 300px)"}
        rows={rows}
        headers={tableHeaders}
      />
      {openModal && selectedClientTypeId && (
        <ClientTypeModal
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          modalTitle="Edit Client Type"
          selectedClientTypeId={selectedClientTypeId}
          cardTypeId={cardTypeId}
          actionType="edit"
        />
      )}
    </div>
  );
};

export { ClientTypesList };
