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
import { CLIENT_TYPE, CLIENT_TYPE_Id, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "../../components/CheckPermission/enum";
import { ExcelButtons } from "../customers/export-import-buttons";
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
    getClientTypesCategories,
    handlePageSizeChange
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
    finalPatternSearch,
    ClientTypeId,
    agentId,
    isActive,
  ]);

  useEffect(() => {
    getClientTypesCategories(CLIENT_TYPE_Id.SUPPLIER);
  }, []);
  
  return (
    <CustomerAuthLayout>
      <Stack
        direction="column"
        justifyContent="space-between"
        display="flex"
        spacing={2}
        height="100%"
      >
        <div style={classes.mainContainer}>
          <div style={classes.headerStyle}>
            <HeaderTitle
              marginTop={1}
              marginBottom={1}
              title={t("suppliers.title")}
            />
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
              stickyHeader={true}
              maxHeight={650} 
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
          </Stack>
        </div>
        <div style={classes.footerStyle}>
           <GoMakePagination
            onChangePageNumber={(event, value) => setPageNumber(value)}
            onChangePageSize={handlePageSizeChange}
            page={pageNumber}
            pagesCount={pagesCount}
            pageSize={pageSize}
          />
          <ExcelButtons
            onClickExport={onClickExportClient}
            onClickImport={onClickImportClient}
          />
        </div>
      </Stack>
    </CustomerAuthLayout>
  );
}
