import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useCustomers } from "./use-customers";
import { AddCustomerButton } from "./add-customer";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { customerMapFunction } from "@/services/api-service/customers/customers-api";
import { CLIENT_TYPE, CLIENT_TYPE_Id, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";

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
    getAgentCategories,
    getClientTypesCategories,
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
    finalPatternSearch,
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
    onClickExportClient,
    onClickImportClient,
    handlePageSizeChange
  } = useCustomers(CLIENT_TYPE.CUSTOMER, pageNumber, setPageNumber);
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
    getAgentCategories();
    getClientTypesCategories(CLIENT_TYPE_Id.CUSTOMER);
  }, []);

  useEffect(() => {
    getAllCustomers();
  }, [
    filters,
    clientType,
    pageNumber,
    pageSize,
    finalPatternSearch,
    ClientTypeId,
    agentId,
    isActive,
  ]);

  return (
    <CustomerAuthLayout permissionEnumValue={Permissions.SHOW_CLIENT}>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={2}
        height="100%"
      >
        <div style={classes.mainContainer}>
          <div style={classes.sameRow}>
            <HeaderTitle
              marginTop={1}
              marginBottom={1}
              title={t("customers.title")}
            />
            <PermissionCheck userPermission={Permissions.ADD_CLIENT}>
              <AddCustomerButton
                isValidCustomer={isValidCustomer}
                onCustomerAdd={onCustomerAdd}
                typeClient={CLIENT_TYPE.CUSTOMER}
              />
            </PermissionCheck>
          </div>
          <HeaderFilter
            typeClient={CLIENT_TYPE.CUSTOMER}
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
            onClickExport={onClickExportClient}
            onClickImport={onClickImportClient}
          />
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={true}
            maxHeight={650}
            rows={getCustomersRows()}
            headers={tableHeaders}
          />
          <CustomerCardWidget
            isValidCustomer={isValidCustomer}
            customerAction={CUSTOMER_ACTIONS.Edit}
            codeFlag={true}
            typeClient={CLIENT_TYPE.CUSTOMER}
            getAllCustomers={getAllCustomers}
            openModal={showCustomerModal}
            modalTitle={t("customers.modal.editTitle")}
            onClose={() => setShowCustomerModal(false)}
            customer={customerForEdit}
            setCustomer={setCustomerForEdit}
            showUpdateButton={true}
          />
        </div>
        <GoMakePagination
          onChangePageNumber={(event, value) => setPageNumber(value)}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
        />
      </Stack>
    </CustomerAuthLayout>
  );
}
