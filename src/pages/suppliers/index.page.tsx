import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import Pagination from '@mui/material/Pagination';
import { useState } from "react";
import Stack from '@mui/material/Stack';
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { customerMapFunction } from "@/services/hooks/get-set-customers";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useStyle } from "./style";
import { HeaderFilter } from "../customers/header-filter";
import { AddCustomerButton } from "../customers/add-customer";
import { useCustomers } from "../customers/use-customers";




export default function Home() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [pageNumber, setPageNumber] = useState(1);
  const { tabelHeaders, updatedStatus, getCustomersRows,setAllCustomers, allCustomers, agentsCategores, clientTypesCategores, statuses, onChangeCustomer, onChangeAgent, onChangeClientType, onChangeStatus, handleClean, name, agentName, valClientType, valStatus, pagesCount, customerForEdit, setCustomerForEdit, showCustomerModal, setShowCustomerModal, getCustomerForEdit, getAllCustomers } = useCustomers("S", pageNumber, setPageNumber);
  const activeText = t("usersSettings.active");
  const inActiveText = t("usersSettings.active");
  const onCustomeradd = (customer) => {
    const mapData = customerMapFunction(customer, getCustomerForEdit, updatedStatus , activeText , inActiveText);
    setAllCustomers([...allCustomers, mapData])
  };

  return (
    <CustomerAuthLayout>
      <div style={classes.headerStyle}>
        <HeaderTitle marginBottom="20px" title={t("suppliers.title")} />
        <AddCustomerButton onCustomeradd={onCustomeradd} typeClient="S"></AddCustomerButton>
      </div>
      <HeaderFilter
        agentsCategores={agentsCategores}
        clientTypesCategores={clientTypesCategores}
        statuses={statuses}
        onChangeAgent={onChangeAgent}
        onChangeCustomer={onChangeCustomer}
        onChangeClientType={onChangeClientType}
        onChangeStatus={onChangeStatus}
        handleClean={handleClean}
        cutomerName={name}
        agentName={agentName}
        valClientType={valClientType}
        valStatus={valStatus}
      />
      <Stack spacing={3}>
        <PrimaryTable rows={getCustomersRows()} headers={tabelHeaders}></PrimaryTable>
        <CustomerCardWidget
          typeClient={"S"}
          getAllCustomers={getAllCustomers}
          openModal={showCustomerModal}
          modalTitle={t("customers.modal.editTitle")}
          onClose={() => setShowCustomerModal(false)}
          customer={customerForEdit}
          setCustomer={setCustomerForEdit}
          showUpdateButton={true}>
        </CustomerCardWidget>
        <div style={{ marginBottom: "5px" }}>
          <Pagination count={pagesCount} variant="outlined" color="primary" page={pageNumber}
            onChange={(event, value) => setPageNumber(value)} />
        </div>
      </Stack>
    </CustomerAuthLayout>
  );
}