import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useStyle } from "./style";
import { HeaderFilter } from "../customers/header-filter";
import { AddCustomerButton } from "../customers/add-customer";
import { useCustomers } from "../customers/use-customers";
import { customerMapFunction } from "@/services/api-service/customers/customers-api";
import { useEffect } from "react";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "../../components/CheckPermission/enum";

export default function Home() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [pageNumber, setPageNumber] = useState(1);
  const {
    isValidCustomer,
    ClientTypeId,
    agentId,
    isActive,
    pageSize,
    filters,
    clientType,
    tableHeaders,
    updatedStatus,
    getCustomersRows,
    setAllCustomers,
    allCustomers,
    agentsCategories,
    clientTypesCategories,
    statuses,
    onChangeCustomer,
    onChangeAgent,
    onChangeClientType,
    onChangeStatus,
    handleClean,
    name,
    agentName,
    valClientType,
    valStatus,
    pagesCount,
    customerForEdit,
    setCustomerForEdit,
    showCustomerModal,
    setShowCustomerModal,
    getCustomerForEdit,
    getAllCustomers,
  } = useCustomers(CLIENT_TYPE.SUPPLIER, pageNumber, setPageNumber);
  const activeText = t("usersSettings.active");
  const inActiveText = t("usersSettings.active");
  const onCustomerAdd = (customer) => {
    const mapData = customerMapFunction(
      customer,
      getCustomerForEdit,
      updatedStatus,
      activeText,
      inActiveText
    );
    setAllCustomers([...allCustomers, mapData]);
  };

  useEffect(() => {
    getAllCustomers();
  }, [
    filters,
    clientType,
    pageNumber,
    pageSize,
    name,
    ClientTypeId,
    agentId,
    isActive,
  ]);

  return (
    <CustomerAuthLayout>
      <div style={classes.maonContainer}>
        <div style={classes.headerStyle}>
          <HeaderTitle marginBottom="20px" title={t("suppliers.title")} />
          <PermissionCheck userPermission={Permissions.EDIT_SUPPLIER}>
            <AddCustomerButton
              isValidCustomer={isValidCustomer}
              onCustomerAdd={onCustomerAdd}
              typeClient={CLIENT_TYPE.SUPPLIER}
            ></AddCustomerButton>
          </PermissionCheck>
        </div>
        <HeaderFilter
          typeClient={CLIENT_TYPE.SUPPLIER}
          agentsCategories={agentsCategories}
          clientTypesCategories={clientTypesCategories}
          statuses={statuses}
          onChangeAgent={onChangeAgent}
          onChangeCustomer={onChangeCustomer}
          onChangeClientType={onChangeClientType}
          onChangeStatus={onChangeStatus}
          handleClean={handleClean}
          customerName={name}
          agentName={agentName}
          valClientType={valClientType}
          valStatus={valStatus}
        />
        <Stack spacing={3}>
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={false}
            rows={getCustomersRows()}
            headers={tableHeaders}
          ></PrimaryTable>
          <CustomerCardWidget
            isValidCustomer={isValidCustomer}
            customerAction={CUSTOMER_ACTIONS.Edit}
            typeClient={CLIENT_TYPE.SUPPLIER}
            getAllCustomers={getAllCustomers}
            openModal={showCustomerModal}
            modalTitle={t("suppliers.editModalTitle")}
            onClose={() => setShowCustomerModal(false)}
            customer={customerForEdit}
            setCustomer={setCustomerForEdit}
            showUpdateButton={true}
          />
          <div style={{ marginBottom: "5px" }}>
            <Pagination
              count={pagesCount}
              variant="outlined"
              color="primary"
              page={pageNumber}
              onChange={(event, value) => setPageNumber(value)}
            />
          </div>
        </Stack>
      </div>
    </CustomerAuthLayout>
  );
}
