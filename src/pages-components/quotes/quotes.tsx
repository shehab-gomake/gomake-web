import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import {
  GoMakeAlertModal,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakeTextInput,
  ThreeOptionsModal,
  GoMakeDialog,
  GomakePrimaryButton,
} from "@/components";
import { DocumentsFilterSection } from "./components/documents-filter-section";
import { HeaderTitle } from "@/widgets";
import { DocumentLogsWidget } from "./widgets/documents-logs-widget/logs-widget";
import { InventoryIntakeModal } from "@/widgets/quote-new/modals-widgets/inventory-intake-modal";
import { PurchaseOrderTypeModal } from "@/widgets/quote-new/modals-widgets/purchase-order-type-modal";
import { DOCUMENT_TYPE } from "./enums";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
} from "@mui/material";
import { CardsSection } from "./widgets/statistics-section/statistics-sections";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { AddRuleModal } from "../products/profits-new/widgets/add-rule-modal";
import { useEffect, useRef } from "react";
import { ScheduledReportsTable } from "./widgets/scheduled-reports-table/scheduled-reports-table";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useRouter } from "next/router";
import { CloseOrderNotesModal } from "../products/profits-new/widgets/close-order-notes-modal";
import { SendPaymentModal } from "./widgets/send-payment-modal/send-payment-modal";
import { MakePaymentModal } from "./widgets/make-payment-modal/make-payment-modal";
import { ExcelMenu } from "./widgets/excel-menu/excel-menu";
import { ModalType } from "@/enums";
import {
  ItemsCountIcon,
  PlusIcon,
  WalletIcon,
} from "./widgets/icons/header-section-icons";
import { TotalCardComponent } from "./widgets/statistics-section/total-card";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { useDeliveryStatusButton } from "./widgets/delivery-status-button/use-delivery-status";
import { useClientContactsList } from "@/hooks/use-client-contacts";
import { UpdateDeliveryStatusModal } from "./widgets/delivery-status-button/delivery-status-modal/delivery-status-modal";
import CloseOrderNote from "./widgets/general/close-order-note";
import { PrintPackingSlipModal } from "../board-missions/widgets/print-packing-slip-modal";
import { DocumentsColumnSettingsMenu } from "./widgets/document-column-settings-menu/document-column-settings-menu";
import {
  documentColumnKeys,
  getDocumentCustomWidth,
  parseSavedColumnSettings,
} from "./states/documents-columns-settings-state";
import { DocumentPrimaryTable } from "@/components/tables/document-primary-table";
import { getDocumentTableSettingsApi } from "@/services/api-service/generic-doc/documents-api";
import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";
import { FONT_FAMILY } from "@/utils/font-family";
import { QR_CODE_LISTENER_FROM } from "@/hooks/use-qr-code-listener";
import QrCodeReader from "@/components/qr-code-reader";
import { useSetRecoilState } from "recoil";
import { selectedItemsState } from "@/store";
import { FrontDeskEmailComposerWrapper } from "./components/frontdesk-email-composer-wrapper";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { useParameters } from "@/hooks/use-parameters";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isFromHomePage?: boolean;
}

const QuotesListPageWidget = ({
  documentType,
  isFromHomePage = false,
}: IProps) => {
  const { classes } = useStyle();
  const router = useRouter();
  const { getClientContacts, clientContacts } = useClientContactsList();
  const {
    onClickCloseModal,
    setPatternSearch,
    patternSearch,
    setStatusId,
    setCustomerId,
    setAgentId,
    renderOptions,
    checkWhatRenderArray,
    updateQuoteStatus,
    onClickSearchFilter,
    onClickClearFilter,
    onClickCloseLogsModal,
    setPage,
    onclickCreateNew,
    t,
    handlePageSizeChange,
    handleCardClick,
    handleSecondCardClick,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    openFilterConfirmationModal,
    onCloseFilterConfirmationModal,
    onContinueWithFilters,
    onResetFiltersAndGenerate,
    openScheduledReportsModal,
    onShowScheduledReports,
    onCloseScheduledReportsModal,
    onToggleScheduledReportActive,
    onDeleteScheduledReport,
    navigate,
    onClickQuotePdf,
    allQuotes,
    quoteStatuses,
    agentsCategories,
    openModal,
    statusId,
    customerId,
    agentId,
    openLogsModal,
    logsModalTitle,
    logsTableHeaders,
    documentLabel,
    allDocuments,
    tableHomeHeader,
    pagesCount,
    page,
    allStatistics,
    pageSize,
    activeCard,
    openAddRule,
    documentPath,
    onSelectDeliveryTimeDates,
    employeeId,
    handleSelectEmployee,
    resetLogsDatePicker,
    onSelectDateRange,
    onClickSearchLogsFilter,
    onClickClearLogsFilter,
    documentLogsData,
    handleMaxPriceChange,
    handleMinPriceChange,
    minPrice,
    maxPrice,
    handleMultiSelectChange,
    productIds,
    productsList,
    getAllProducts,
    accountingStatuses,
    accountingStatus,
    productionStatuses,
    productionStatus,
    handleProductionStatusChange,
    handleAccountingStatusChange,
    handleClick,
    handleClose,
    open,
    anchorEl,
    filterData,
    filterDTO,
    updateCancelQuote,
    openIrrelevantCancelModal,
    onClickCloseIrrelevantModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    onClickCloseDeliveryTimeModal,
    onClickClosePriceModal,
    showCustomerModal,
    customerForEdit,
    setCustomerForEdit,
    setShowCustomerModal,
    setIsCanceledState,
    isCanceledState,
    openCloseOrderNotesModal,
    onClickCloseCloseOrderNotesModal,
    onClickCloseOrderCallback,
    selectedQuoteItemValue,
    paymentModalTitle,
    openPaymentModal,
    onClickClosePaymentModal,
    onClickCloseCloseOrderModal,
    openCloseOrderModal,
    selectedDocument,
    onClickOpenCloseOrderModal,
    ManuallyCloseDocument,
    documentCloseNumber,
    handleDocumentNumberChange,
    approvalStatuses,
    setApprovalStatusId,
    approvalStatusId,
    openMakePaymentModal,
    onClickCloseMakePaymentModal,
    isOrdersTracking,
    onClickCloseTrackModal,
    openCloseAndTrackOrderModal,
    closeAndTrackOrder,
    onClickClosePrintPDFModal,
    openPrintPDFModal,
    fromDate,
    toDate,
    getAllQuotes,
    openCancelReceiptModal,
    onCloseCancelReceiptModal,
    onClickCancelReceipt,
    openCancelReceiptModalRefund,
    onCloseCancelReceiptModalRefund,
    ExportDocumentTableToExcel,
    isFetching,
    openChangeProductionStatusModal,
    isSelectedCLoseAsDeliveryNote,
    isSelectedCLoseAsProformaInvoice,
    onClickCloseChangeProductionStatusModal,
    moveOrderToReady,
    onChangeDocumentSearch,
    isPausedOrders,
    setIsPausedOrders,
    openDuplicateModal,
    onCloseDuplicateModal,
    onClickDocumentDuplicate,
    searchInputRef,
    openExportReceiptPdfModal,
    onCloseExportReceiptPdfModal,
    startOrderProduction,
    openStartProductionModal,
    onClickCloseStartProductionModal,
    getValueByKey,
    isOrder,
    isQuote,
    isDeliveryNote,
    isProformaInvoice,
    isInvoice,
    deliveryStatuses,
    deliveryStatus,
    setDeliveryStatus,
    setFromDate,
    setToDate,
    isPurchaseDocument,
    isSendToClient,
    isReceipt,
    isSupplierPayments,
    isPurchaseOrder,
    openInventoryIntakeModal,
    onClickCloseInventoryIntakeModal,
    inventoryData,
    inventoryLoading,
    selectedDocument: selectedInventoryDocument,
    isMoveToReady,
    handleCheckboxChange,
    handleSortBE,
    isDescOrderBE,
    isHeaderSortable,
    onClickCloseReopenDocumentModal,
    openReopenDocModal,
    OpenDocument,
    deliveryOrderId,
    deliveryOrderNumber,
    deliveryCustomerId,
    isSendOrderReadyToClient,
    alertNotVerifiedMailModal,
    alertNotVerifiedModalState,
    showAlertModal,
    handleRemoveDraftBtnClick,
    removeDraftModal,
    onCloseOpenRemoveDraftModal,
    MoveOrderToReady,
    onClickPrintPackagingSlip,
    handleQuantityPerPackageChange,
    handleQuantityOfPackagesChange,
    quantityPerPackage,
    quantityOfPackages,
    packageInputs,
    onClosePackagesModal,
    openPackagesModal,
    openPrintExportModal,
    setOpenPrintExportModal,
    exportPdf,
    printPackingSlip,
    isPrintHouseHasPackagingSlipPrinter,
    paymentType,
    handlePaymentTypeChange,
    typeOfPayments,
    initialPageSize,
    ExportDocumentTableToPdf,
    tableKey,
    visibleHeaders,
    columnsReady,
    setColumnsReady,
    setColumnOrder,
    setColumnVisibility,
    callApi,
    onClickCloseMoveOrderToReadyModal,
    onClickOpenMoveOrderToReadyModal,
    moveToReadyOption,
    handleRadioChange,
    primaryColor,
    currencyFilter,
    setCurrencyFilter,
    currencies,
    isDocumentTableLoading,
    isDocumentTableError,
    isSocketRefreshingDocuments,
    scheduledReports,
    totalCount: scheduledReportsTotalCount,
    pageNumber: scheduledReportsPageNumber,
    pagesCountScheduledReports: scheduledReportsPagesCount,
    isLoading: scheduledReportsIsLoading,
    createScheduledReport,
    handlePageChange: handleScheduledReportsPageChange,
    handlePageSizeChangeScheduledReports: handleScheduledReportsPageSizeChange,
    isEmailComposerOpen,
    emailData,
    closeEmailComposer,
    documentForEmail,
    openPurchaseOrderTypeModal,
    onOpenPurchaseOrderTypeModal,
    onClosePurchaseOrderTypeModal,
    handleSelectPurchaseOrderType,
  } = useQuotes(documentType, isFromHomePage);

  // Get the main quotes pagination handler
  const { handlePageSizeChange: handleQuotesPageSizeChange } = useQuotes(
    documentType,
    isFromHomePage
  );

  // Use page size of 10 for scheduled reports
  const scheduledReportsPageSize = 10;

  const {
    openDeliveryModal,
    onCloseDeliveryModal,
    renderTableRows,
    editableQuantities,
    setEditableQuantities,
    setDocumentItems,
    getDocumentDeliveryItems,
    selectedItem,
    removeDocumentDeliveryItem,
    onCloseDeleteModal,
    openDeleteModal,
  } = useDeliveryStatusButton();

  //! I think we don't need this
  useEffect(() => {
    if (router.query.orderNumber) {
      setPatternSearch(router.query.orderNumber as string);
    } else if (router.query.documentNumber) {
      setPatternSearch(router.query.documentNumber as string);
    }
  }, [router]);
  useEffect(() => {
    if (router.query.isComeFromQR) {
      getDocumentDeliveryItems(DOCUMENT_TYPE.order, router.query.orderId);
      getClientContacts(router.query.clientId);
    }
  }, [router]);

  useEffect(() => {
    !isFromHomePage && getAllProducts();
  }, []);

  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";

  const renderCreateNewButton = (onClickHandler) => (
    <Button
      sx={{
        ...classes.createNewDocument,
        "& .MuiButton-startIcon": {
          ...(RTL
            ? { marginLeft: "4px", marginRight: 0 }
            : { marginRight: "4px", marginLeft: 0 }),
        },
      }}
      onClick={onClickHandler}
      startIcon={<PlusIcon stroke={primaryColor(500)} />}
    >
      {t("sales.quote.createNew")}
    </Button>
  );

  const renderOrderCard = (onclickCreateNew) => (
    <>
      <PermissionCheck
        userPermission={Permissions.SHOW_ERP_DOCUMENTS_TABLE_SUMMERY}
      >
        {allQuotes ? (
          <>
            <TotalCardComponent
              text={`${t("sales.list.totalItemsCounts", {
                documentType: t(`sales.list.${DOCUMENT_TYPE[documentType]}`),
              })}`}
              number={allStatistics?.totalItems}
              icon={<ItemsCountIcon />}
            />
            <TotalCardComponent
              text={t("sales.quote.totalPrice")}
              number={getValueByKey(
                allStatistics?.documentStatisticsList,
                "totalPrice"
              )}
              icon={<WalletIcon />}
              withCurrency={true}
            />
          </>
        ) : (
          <>
            <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
            <Skeleton variant="rectangular" sx={classes.skeltonStyle} />
          </>
        )}
      </PermissionCheck>

      {renderCreateNewButton(onclickCreateNew)}
    </>
  );

  const handleOpenDeliveryModal = (orderId) => {
    getDocumentDeliveryItems(DOCUMENT_TYPE.order, orderId);
    getClientContacts(deliveryCustomerId);
  };

  const handleCloseDeliveryModal = () => {
    onCloseDeliveryModal();
    router.push(router.pathname, undefined, { shallow: true });
  };

  useEffect(() => {
    if (deliveryOrderId) {
      handleOpenDeliveryModal(deliveryOrderId);
    }
  }, [router.query.deliveryOrderId]);

  useEffect(() => {
    const loadDocumentColumnSettings = async () => {
      try {
        const res = await getDocumentTableSettingsApi(callApi, () => {}, {
          documentType,
        });
        const saved: ColumnSetting[] = res?.data;
        const allColumnKeys = documentColumnKeys[tableKey];

        if (saved && saved.length > 0) {
          const { order, visibility } = parseSavedColumnSettings(
            saved,
            allColumnKeys
          );
          setColumnOrder(order);
          setColumnVisibility(visibility);
        } else {
          setColumnOrder(allColumnKeys);
          setColumnVisibility(
            Object.fromEntries(allColumnKeys.map((key) => [key, true])) // Default to true (checked) when API returns empty
          );
        }
      } catch (error) {
        console.error("Failed to load document column settings", error);
      } finally {
        setColumnsReady(true);
      }
    };

    loadDocumentColumnSettings();
  }, [documentType, tableKey]);
  const setSelectedItems = useSetRecoilState(selectedItemsState);
  const { parametersStateValue } = useParameters();

  return (
    <>
      {!isFromHomePage && (
        <Stack
          direction="column"
          justifyContent="space-between"
          display="flex"
          spacing={2}
          height="100%"
        >
          <QrCodeReader qrCodeListenerFrom={QR_CODE_LISTENER_FROM.QUOTES} />
          <div style={classes.mainContainer}>
            {/* header section */}
            <div style={classes.headerStyle}>
              <HeaderTitle
                title={documentLabel}
                marginTop={1}
                marginBottom={1}
              />
              <div style={classes.rowStyle}>
                {isQuote && (
                  <CardsSection
                    statistics={allStatistics?.documentStatisticsList}
                    activeCard={activeCard}
                    onClick={onclickCreateNew}
                    onClickCard={handleCardClick}
                    onSecondClickCard={handleSecondCardClick}
                  />
                )}

                {!isQuote &&
                  !isOrdersTracking &&
                  renderOrderCard(
                    isOrder
                      ? onclickCreateNew
                      : isSupplierPayments
                      ? () => navigate(`/${documentPath}`)
                      : isPurchaseOrder
                      ? () => {
                          setSelectedItems([]);
                          onOpenPurchaseOrderTypeModal();
                        }
                      : () => {
                          setSelectedItems([]);
                          navigate(`/${documentPath}?isNewCreation=true`);
                        }
                  )}
              </div>
            </div>
            {/* Filters Section */}
            <DocumentsFilterSection
              customerId={customerId}
              setCustomerId={setCustomerId}
              renderOptions={renderOptions}
              checkWhatRenderArray={checkWhatRenderArray}
              isFetching={isFetching}
              isPurchaseDocument={isPurchaseDocument}
              agentId={agentId}
              setAgentId={setAgentId}
              agentsCategories={agentsCategories}
              isQuote={isQuote}
              statusId={statusId}
              setStatusId={setStatusId}
              setPage={setPage}
              quoteStatuses={quoteStatuses}
              approvalStatusId={approvalStatusId}
              setApprovalStatusId={setApprovalStatusId}
              approvalStatuses={approvalStatuses}
              isOrder={isOrder}
              productionStatus={productionStatus}
              handleProductionStatusChange={handleProductionStatusChange}
              productionStatuses={productionStatuses}
              accountingStatus={accountingStatus}
              handleAccountingStatusChange={handleAccountingStatusChange}
              accountingStatuses={accountingStatuses}
              isDeliveryNote={isDeliveryNote}
              isProformaInvoice={isProformaInvoice}
              isInvoice={isInvoice}
              deliveryStatus={deliveryStatus}
              setDeliveryStatus={setDeliveryStatus}
              deliveryStatuses={deliveryStatuses}
              documentType={documentType}
              DOCUMENT_TYPE={DOCUMENT_TYPE}
              handleMultiSelectChange={handleMultiSelectChange}
              productsList={productsList}
              productIds={productIds}
              currencyFilter={currencyFilter}
              setCurrencyFilter={setCurrencyFilter}
              currencies={currencies}
              isPurchaseOrder={isPurchaseOrder}
              isCanceledState={isCanceledState}
              setIsCanceledState={setIsCanceledState}
              isReceipt={isReceipt}
              isSupplierPayments={isSupplierPayments}
              paymentType={paymentType}
              handlePaymentTypeChange={handlePaymentTypeChange}
              typeOfPayments={typeOfPayments}
              isPausedOrders={isPausedOrders}
              setIsPausedOrders={setIsPausedOrders}
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              fromDate={fromDate}
              toDate={toDate}
              onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
              patternSearch={patternSearch}
              onChangeDocumentSearch={onChangeDocumentSearch}
              onClickClearFilter={onClickClearFilter}
              onClickSearchFilter={onClickSearchFilter}
              columnsReady={columnsReady}
              tableKey={tableKey}
              onOpenAddRuleModal={onOpenAddRuleModal}
              ExportDocumentTableToExcel={ExportDocumentTableToExcel}
              ExportDocumentTableToPdf={ExportDocumentTableToPdf}
              DocumentsColumnSettingsMenu={DocumentsColumnSettingsMenu}
              ExcelMenu={ExcelMenu}
              classes={classes}
            />
            {/* document table */}
            <>
              {columnsReady ? (
                <DocumentPrimaryTable
                  stickyFirstCol={false}
                  stickyHeader={true}
                  maxHeight={"calc(100vh - 265px)"}
                  rows={allQuotes}
                  headers={visibleHeaders}
                  withSortBE={true}
                  onClickSortBE={handleSortBE}
                  isDescOrderBE={isDescOrderBE}
                  isHeaderSortable={isHeaderSortable}
                  docType={documentType}
                  columnWidths={visibleHeaders.map((key) =>
                    getDocumentCustomWidth(tableKey, key)
                  )}
                  loading={isDocumentTableLoading}
                  error={isDocumentTableError}
                  disableSkeleton={isSocketRefreshingDocuments}
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <CircularProgress />
                </Box>
              )}
            </>
          </div>
          <GoMakePagination
            onChangePageNumber={(event, value) => {
              setPage(value);
              router.push({
                pathname: router.pathname,
                query: { ...router.query, pageNumber: value },
              });
            }}
            onChangePageSize={handleQuotesPageSizeChange}
            page={page}
            setPage={setPage}
            pagesCount={pagesCount}
            pageSize={pageSize}
            router={router}
            isFromDocumentsOrJobs={true}
            initialPageSize={initialPageSize}
          />
        </Stack>
      )}
      {isFromHomePage && (
        <PrimaryTable
          stickyHeader={true}
          maxHeight={"calc(100vh)"}
          rows={allDocuments}
          headers={tableHomeHeader}
          variant="OddEvenTable"
          withoutShadow={true}
        />
      )}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleModal")}
        subTitle={t("sales.quote.subTitleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openModal}
        onClose={onClickCloseModal}
        onClickDelete={() => updateQuoteStatus()}
      />
      <GoMakeModal
        insideStyle={classes.insideStyle}
        openModal={openLogsModal}
        onClose={onClickCloseLogsModal}
        modalTitle={logsModalTitle}
      >
        <DocumentLogsWidget
          employeeId={employeeId}
          handleSelectEmployee={handleSelectEmployee}
          onClickClearLogsFilter={onClickClearLogsFilter}
          onClickSearchLogsFilter={onClickSearchLogsFilter}
          resetLogsDatePicker={resetLogsDatePicker}
          onSelectDateRange={onSelectDateRange}
          logsTableHeaders={logsTableHeaders}
          logsTableRows={documentLogsData}
        />
      </GoMakeModal>
      {!isFromHomePage && (
        <AddRuleModal
          openModal={openAddRule}
          onCloseModal={onCloseAddRuleModal}
          isQuoteWidge={true}
          filterData={filterData}
          filterDTO={filterDTO}
          documentType={documentType}
          onShowScheduledReports={onShowScheduledReports}
          createScheduledReport={createScheduledReport}
          parametersStateValue={parametersStateValue}
        />
      )}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.list.filterConfirmationTitle")}
        subTitle={t(" ")}
        yesBtn={t("sales.list.continueWithCurrentFilters")}
        cancelBtn={t("sales.list.resetFiltersAndGenerate")}
        openModal={openFilterConfirmationModal}
        onClose={onCloseFilterConfirmationModal}
        onClickDelete={onContinueWithFilters}
        onClickCancel={onResetFiltersAndGenerate}
        style={{ width: "35%" }}
      />
      <ScheduledReportsTable
        openModal={openScheduledReportsModal}
        onCloseModal={onCloseScheduledReportsModal}
        scheduledReports={scheduledReports || []}
        totalCount={scheduledReportsTotalCount}
        pageNumber={scheduledReportsPageNumber}
        pageSize={scheduledReportsPageSize}
        pagesCount={scheduledReportsPagesCount}
        isLoading={scheduledReportsIsLoading}
        onToggleActive={onToggleScheduledReportActive}
        onDelete={onDeleteScheduledReport}
        onPageChange={handleScheduledReportsPageChange}
        onPageSizeChange={handleScheduledReportsPageSizeChange}
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openIrrelevantCancelModal}
        onClose={onClickCloseIrrelevantModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_IRRELEVANT)
        }
      />
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPriceCancelModal}
        onClose={onClickClosePriceModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote(QuoteStatuses.CANCELED_PRICE)}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleCloseModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openCloseOrderModal}
        onClose={onClickCloseCloseOrderModal}
        subTitle={`${t("sales.quote.subTitleCloseModal", {
          documentName: t(
            `sales.quote.${DOCUMENT_TYPE[documentType]}`
          ).toLowerCase(),
        })}?`}
        onClickDelete={() => ManuallyCloseDocument(selectedDocument)}
        style={{ width: "35%" }}
      >
        <GomakeTextInput
          style={{ height: "40px", minWidth: 180 }}
          placeholder={t("sales.enterDocumentNumber")}
          value={documentCloseNumber}
          onChange={handleDocumentNumberChange}
        />
      </GoMakeDeleteModal>
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openDeliveryTimeCancelModal}
        onClose={onClickCloseDeliveryTimeModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() =>
          updateCancelQuote(QuoteStatuses.CANCELED_DELIVERY_TIME)
        }
      />
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={
          isPurchaseDocument && !isPurchaseOrder
            ? CLIENT_TYPE.SUPPLIER
            : CLIENT_TYPE.CUSTOMER
        }
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
      />
      <CloseOrderNotesModal
        onClose={onClickCloseCloseOrderNotesModal}
        openModal={openCloseOrderNotesModal}
        quoteItemValue={selectedQuoteItemValue}
        onClickCloseOrder={onClickCloseOrderCallback}
      />
      <SendPaymentModal
        openPaymentModal={openPaymentModal}
        onClickClosePaymentModal={onClickClosePaymentModal}
        paymentModalTitle={paymentModalTitle}
        documentType={documentType}
        isSendToClient={isSendToClient}
        isSendOrderReadyToClient={isSendOrderReadyToClient}
        showAlertModal={showAlertModal}
        hideCheckboxes={true}
      />
      <GoMakeAlertModal
        openModal={alertNotVerifiedMailModal.isOpen}
        onClose={() => {
          alertNotVerifiedMailModal.close();
        }}
        onClickConfirm={() => {
          alertNotVerifiedModalState.onConfirm?.();
          alertNotVerifiedMailModal.close();
        }}
        subTitle={alertNotVerifiedModalState.message}
        withCancelBtn={!!alertNotVerifiedModalState.onConfirm}
      />
      <MakePaymentModal
        openMakePaymentModal={openMakePaymentModal}
        onClickCloseMakePaymentModal={onClickCloseMakePaymentModal}
        orderItemValue={selectedQuoteItemValue}
        getAllQuotes={getAllQuotes}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.closeAndTrackTitle")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openCloseAndTrackOrderModal}
        onClose={onClickCloseTrackModal}
        onClickDelete={closeAndTrackOrder}
        style={{ width: "35%" }}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={
          isProformaInvoice
            ? t("sales.quote.printProformaInvoiceWithPrices")
            : t("sales.quote.printDeliveryNoteWithPrices")
        }
        openModal={openPrintPDFModal}
        yesBtn={t("sales.quote.yesBtn")}
        cancelBtn={t("sales.quote.noBtn")}
        onClose={onClickClosePrintPDFModal}
        hideIcon
        onClickDelete={() => {
          onClickQuotePdf(selectedDocument?.id, true);
        }}
        onClickCancel={() => {
          onClickQuotePdf(selectedDocument?.id, false);
        }}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("payment.cancelReceipt")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openCancelReceiptModal}
        onClose={onCloseCancelReceiptModal}
        onClickDelete={onClickCancelReceipt}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={
          isSelectedCLoseAsDeliveryNote
            ? "customers.modal.closeOrderAsDeliveryNote"
            : isSelectedCLoseAsProformaInvoice
            ? "customers.modal.closeOrderAsProformaInvoice"
            : "customers.modal.closeOrderAsInvoice"
        }
        subTitle={"customers.modal.thisOrderIsAlreadyInProcess"}
        yesBtn={
          isSelectedCLoseAsDeliveryNote
            ? t("customers.modal.closeAsDeliveryNote")
            : isSelectedCLoseAsProformaInvoice
            ? t("customers.modal.closeAsProformaInvoice")
            : t("customers.modal.closeAsInvoice")
        }
        openModal={openChangeProductionStatusModal}
        onClose={onClickCloseChangeProductionStatusModal}
        onClickDelete={() => {
          if (isMoveToReady) {
            moveOrderToReady(moveToReadyOption === "withMessage");
          } else {
            if (isSelectedCLoseAsDeliveryNote) {
              const path = `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`;
              window.open(path, "_blank");
            } else if (isSelectedCLoseAsProformaInvoice) {
              const path = isOrder
                ? `/proformaInvoice?isNewCreation=true&orderId=${selectedDocument?.id}`
                : `/proformaInvoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
              window.open(path, "_blank");
            } else {
              const path = isOrder
                ? `/invoice?isNewCreation=true&orderId=${selectedDocument?.id}`
                : `/invoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
              window.open(path, "_blank");
            }
          }
        }}
      >
        <Stack alignItems={"center"} spacing={2}>
          <div
            style={{
              ...classes.inputLbl,
              color: isMoveToReady ? "black" : "#475467",
            }}
          >
            <PrimaryCheckbox
              checked={isMoveToReady}
              onChange={handleCheckboxChange}
            />
            {t("sales.moveToReadyAndCloseOrder")}
          </div>
          {isMoveToReady && (
            <RadioGroup
              row
              value={moveToReadyOption}
              onChange={handleRadioChange}
              style={{ marginTop: 8 }}
            >
              <FormControlLabel
                value="withoutMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithoutMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
              <FormControlLabel
                value="withMessage"
                control={
                  <Radio
                    sx={{ transform: "scale(0.8)", p: 0.5 }}
                    style={{ color: primaryColor(300) }}
                  />
                }
                label={t("sales.moveToReadyWithMessage")}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    ...FONT_FAMILY.Lexend(500, 13),
                  },
                }}
              />
            </RadioGroup>
          )}
          <CloseOrderNote note={selectedDocument?.closeOrderNotes} />
        </Stack>
      </GoMakeDeleteModal>
      <ThreeOptionsModal
        title={t("payment.cancelReceipt")}
        yesBtn={t("payment.CancelWithRefund")}
        noBtn={t("payment.CancelWithoutRefund")}
        openModal={openCancelReceiptModalRefund}
        onClose={onCloseCancelReceiptModalRefund}
        onClickYes={() => {
          onClickCancelReceipt(true);
          onCloseCancelReceiptModalRefund();
        }}
        onClickNo={() => {
          onClickCancelReceipt(false);
          onCloseCancelReceiptModalRefund();
        }}
      />
      <ThreeOptionsModal
        modalType={ModalType.DUPLICATE}
        title={t("boardMissions.duplicateModalTitle")}
        yesBtn={"boardMissions.duplicateModalYes"}
        noBtn={"boardMissions.duplicateModalNo"}
        openModal={openDuplicateModal}
        onClose={onCloseDuplicateModal}
        onClickYes={() => onClickDocumentDuplicate(selectedDocument?.id, true)}
        onClickNo={() => onClickDocumentDuplicate(selectedDocument?.id, false)}
      />
      <ThreeOptionsModal
        title={t("sales.modals.printReceipt")}
        subTitle={t("sales.modals.includeInvoicesPdfPrompt")}
        yesBtn={"sales.modals.withInvoices"}
        noBtn={"sales.modals.withoutInvoices"}
        openModal={openExportReceiptPdfModal}
        onClose={onCloseExportReceiptPdfModal}
        onClickYes={() => onClickQuotePdf(selectedDocument?.id, false, true)}
        onClickNo={() => onClickQuotePdf(selectedDocument?.id, false, false)}
        hideIcon
      />
      <GoMakeDeleteModal
        hideIcon
        title={t("sales.tables.startProduction")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openStartProductionModal}
        onClose={onClickCloseStartProductionModal}
        subTitle={t("sales.modals.confirmSendToProduction")}
        onClickDelete={startOrderProduction}
      />
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={`${t("sales.quote.ReopenModalTitle", {
          documentName: t(
            `sales.quote.${DOCUMENT_TYPE[documentType]}`
          ).toLowerCase(),
        })}`}
        openModal={openReopenDocModal}
        onClose={onClickCloseReopenDocumentModal}
        subTitle={`${t("sales.quote.ReopenModalSubTitle", {
          documentName: t(
            `sales.quote.${DOCUMENT_TYPE[documentType]}`
          ).toLowerCase(),
        })}`}
        onClickDelete={() => OpenDocument(selectedDocument)}
        style={{ width: "35%" }}
        yesBtn={t("sales.quote.yesBtn")}
      />
      {/* Delivery Modal */}
      <UpdateDeliveryStatusModal
        openModal={openDeliveryModal}
        onCloseModal={handleCloseDeliveryModal}
        document={document}
        documentItems={renderTableRows()}
        editableQuantities={editableQuantities}
        setEditableQuantities={setEditableQuantities}
        setDocumentItems={setDocumentItems}
        clientContacts={clientContacts}
        documentType={DOCUMENT_TYPE.order}
        documentId={deliveryOrderId?.toString()}
        documentNumber={deliveryOrderNumber?.toString()}
        onClickOpenMoveOrderToReadyModal={onClickOpenMoveOrderToReadyModal}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        onClickDelete={() => removeDocumentDeliveryItem(selectedItem)}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={removeDraftModal.isOpen}
        onClose={onCloseOpenRemoveDraftModal}
        onClickDelete={handleRemoveDraftBtnClick}
      />
      {/* <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        title={t("sales.moveToReadyAndCloseOrder")}
        openModal={MoveOrderToReady.isOpen}
        onClose={onClickCloseMoveOrderToReadyModal}
        onClickDelete={moveOrderToReady}
      /> */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={t("boardMissions.markDoneModalTitle")}
        subTitle={t("boardMissions.markDoneModalSubTitle")}
        yesBtn={"boardMissions.markDoneModalYes"}
        noBtn={"boardMissions.markDoneModalNo"}
        openModal={MoveOrderToReady.isOpen}
        onClose={onClickCloseMoveOrderToReadyModal}
        onClickYes={() => moveOrderToReady(true)}
        onClickNo={() => moveOrderToReady(false)}
      />
      <PrintPackingSlipModal
        openPackagesModal={openPackagesModal}
        onClosePackagesModal={onClosePackagesModal}
        packageInputs={packageInputs}
        quantityOfPackages={quantityOfPackages}
        quantityPerPackage={quantityPerPackage}
        handleQuantityOfPackagesChange={handleQuantityOfPackagesChange}
        handleQuantityPerPackageChange={handleQuantityPerPackageChange}
        onClickConfirm={onClickPrintPackagingSlip}
        openPrintExportModal={openPrintExportModal}
        setOpenPrintExportModal={setOpenPrintExportModal}
        exportPdf={exportPdf}
        printPackingSlip={printPackingSlip}
        isPrintHouseUsePrintNode={isPrintHouseHasPackagingSlipPrinter}
      />
      {/* FrontDesk Email Composer */}
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={documentForEmail?.id}
          documentType={documentType}
        />
      )}
      <PurchaseOrderTypeModal
        open={openPurchaseOrderTypeModal}
        onClose={onClosePurchaseOrderTypeModal}
        onSelectProduct={() => handleSelectPurchaseOrderType(false)}
        onSelectMaterial={() => handleSelectPurchaseOrderType(true)}
      />
      <InventoryIntakeModal
        open={openInventoryIntakeModal}
        onClose={onClickCloseInventoryIntakeModal}
        inventoryData={inventoryData}
        loading={inventoryLoading}
        purchaseOrderId={selectedInventoryDocument?.id}
        documentType={DOCUMENT_TYPE.purchaseOrder}
      />
      {/* FrontDesk Email Composer */}
      {isEmailComposerOpen && (
        <FrontDeskEmailComposerWrapper
          open={isEmailComposerOpen}
          onClose={closeEmailComposer}
          emailData={emailData}
          documentId={documentForEmail?.id}
          documentType={documentType}
        />
      )}
    </>
  );
};

export { QuotesListPageWidget };
