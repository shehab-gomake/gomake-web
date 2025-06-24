import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { CustomerAuthLayout } from "@/layouts";
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
import {
  CLIENT_TYPE,
  CLIENT_TYPE_Id,
  CUSTOMER_ACTIONS,
} from "@/pages/customers/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "../../components/CheckPermission/enum";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { ThreeOptionsModal } from "@/components";
import { ClientUploadExcelErrorsModal } from "../customers/export-import-buttons/errors-messages-modal";
import { ModalType } from "@/enums";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ClientTypesList } from "@/widgets/client-types/client-types-list";
import { ITab } from "@/components/tabs/interface";
import { AddButton } from "@/components/button/add-button";
import { ClientTypeModal } from "@/widgets/client-types/components/add-edit-client-type-modal";
import { StepStatus } from "@/store/print-house-setup-state-state";

export default function Home() {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [pageNumber, setPageNumber] = useState(1);
  const {
    ClientTypeId,
    agentId,
    isActive,
    setPageSize,
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
    handlePageSizeChange,
    openExportModal,
    onOpenExportClientModal,
    onCloseExportClientModal,
    openErrorsModal,
    handleErrorsModalClose,
    errorMessages,
    isRTL,
    value,
    setValue,
    openClientTypeModal,
    setOpenClientTypeModal,
    addSupplierStep,
    pageSize,
    initialPageSize,
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

  const renderAddButton = (activeTabTitle: string) => {
    if (activeTabTitle === t("suppliers.title")) {
      return (
        <PermissionCheck userPermission={Permissions.EDIT_SUPPLIER}>
          <AddCustomerButton
            onCustomerAdd={onCustomerAdd}
            typeClient={CLIENT_TYPE.SUPPLIER}
            isEmpty={addSupplierStep?.status === StepStatus.IN_PROGRESS}
          />
        </PermissionCheck>
      );
    } else if (activeTabTitle === t("suppliers.supplierTypes")) {
      return (
        <AddButton
          style={{ width: "fit-content", alignSelf: "flex-end" }}
          onClick={() => setOpenClientTypeModal(!openClientTypeModal)}
          label={t("suppliers.addSupplierType")}
        />
      );
    }
    return null;
  };

  const tabs: ITab[] = [
    {
      title: t("suppliers.title"),
      component: (
        <Stack
          direction="column"
          justifyContent="space-between"
          display="flex"
          spacing={2}
          height="100%"
        >
          <div style={classes.mainContainer}>
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
              onClickExport={onOpenExportClientModal}
              onClickImport={onClickImportClient}
            />
            <>
              <PrimaryTable
                stickyFirstCol={false}
                stickyHeader={true}
                maxHeight={"calc(100vh - 300px)"}
                rows={getCustomersRows()}
                headers={tableHeaders}
              />
              <CustomerCardWidget
                typeClient={CLIENT_TYPE.SUPPLIER}
                customerAction={CUSTOMER_ACTIONS.Edit}
                getAllCustomers={getAllCustomers}
                openModal={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                customer={customerForEdit}
                setCustomer={setCustomerForEdit}
              />
              <ThreeOptionsModal
                modalType={ModalType.WARNING}
                title={t("customers.modal.exportClients")}
                subTitle={t("customers.modal.exportPrompt")}
                yesBtn={"customers.modal.includeContacts"}
                noBtn={"customers.modal.excludeContacts"}
                openModal={openExportModal}
                onClose={onCloseExportClientModal}
                onClickYes={() => onClickExportClient(true)}
                onClickNo={() => onClickExportClient(false)}
              />
              <ClientUploadExcelErrorsModal
                openErrorsModal={openErrorsModal}
                handleErrorsModalClose={handleErrorsModalClose}
                errorMessages={errorMessages}
              />
            </>
          </div>
          <GoMakePagination
            onChangePageNumber={(event, value) => setPageNumber(value)}
            onChangePageSize={handlePageSizeChange}
            page={pageNumber}
            setPage={setPageNumber}
            pagesCount={pagesCount}
            pageSize={pageSize}
            initialPageSize={initialPageSize}
          />
        </Stack>
      ),
    },
    {
      title: t("suppliers.supplierTypes"),
      component: <ClientTypesList clientType={CLIENT_TYPE.SUPPLIER} />,
    },
    ,
  ];

  return (
    <CustomerAuthLayout
      permissionEnumValue={Permissions.SHOW_SUPPLIER}
      className={`custom-scrollbar`}
      staticPageTitle={"suppliers"}
    >
      <PrimaryTabsComponent
        style={{ padding: isRTL ? "0px 10px 0px 20px" : "0px 20px 0px 10px" }}
        tabs={tabs}
        onSelectTab={(newIndex) => {
          setValue(newIndex);
        }}
      >
        {renderAddButton(tabs[value]?.title || "")}
      </PrimaryTabsComponent>
      {openClientTypeModal && (
        <ClientTypeModal
          openModal={openClientTypeModal}
          onClose={() => setOpenClientTypeModal(false)}
          modalTitle={t("suppliers.addSupplierType")}
          cardTypeId={CLIENT_TYPE_Id.SUPPLIER}
          actionType="add"
        />
      )}
    </CustomerAuthLayout>
  );
}
