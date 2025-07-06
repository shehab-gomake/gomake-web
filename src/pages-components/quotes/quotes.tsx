import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import {
  GoMakeAlertModal,
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
  ThreeOptionsModal,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { HeaderTitle } from "@/widgets";
import { DocumentLogsWidget } from "./widgets/documents-logs-widget/logs-widget";
import { DOCUMENT_TYPE } from "./enums";
import { Box, Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import { CardsSection } from "./widgets/statistics-section/statistics-sections";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { AddRuleModal } from "../products/profits-new/widgets/add-rule-modal";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { useRouter } from "next/router";
import { CloseOrderNotesModal } from "../products/profits-new/widgets/close-order-notes-modal";
import { SendPaymentModal } from "./widgets/send-payment-modal/send-payment-modal";
import { MakePaymentModal } from "./widgets/make-payment-modal/make-payment-modal";
import { DateRangePicker } from "rsuite";
import { createGlobalStyle } from "styled-components";
import { ExcelMenu } from "./widgets/excel-menu/excel-menu";
import { DotIcon } from "@/icons";
import { ModalType } from "@/enums";
import TuneIcon from "@mui/icons-material/Tune";
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
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import CloseOrderNote from "./widgets/general/close-order-note";
import { PrintPackingSlipModal } from "../board-missions/widgets/print-packing-slip-modal";
import { predefinedRanges } from "@/utils/dateRanges";
import { ColumnSettingsMenu } from "@/widgets/production-floor/table-view/components/column-settings-menu";
import { DocumentsColumnSettingsMenu } from "./widgets/document-column-settings-menu/document-column-settings-menu";
import {
  documentColumnKeys,
  getDocumentCustomWidth,
  parseSavedColumnSettings,
} from "./states/documents-columns-settings-state";
import { DocumentPrimaryTable } from "@/components/tables/document-primary-table";
import { getDocumentTableSettingsApi } from "@/services/api-service/generic-doc/documents-api";
import { ColumnSetting } from "@/widgets/production-floor/state/production-floor-coulmns-table-settings";

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
    onClickCloseMoveOrderToReadyModal,
    onClickPrintPackagingSlip,
    handleQuantityPerPackageChange,
    handleQuantityOfPackagesChange,
    quantityPerPackage,
    quantityOfPackages,
    packageInputs,
    onClosePackagesModal,
    openPackagesModal,
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
  } = useQuotes(documentType, isFromHomePage);

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
    !isFromHomePage && getAllProducts();
  }, []);

  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const GlobalStyle = createGlobalStyle`
  .rs-picker-popup-daterange {
    left: ${({ RTL }: any) => (RTL ? "auto" : "515px")} !important;
    right: ${({ RTL }: any) => (RTL ? "530px" : "auto")} !important;
    top: 320px !important;
  }
`;

  const pickerRef = useRef(null);

  const handleSelect = (date) => {
    if (!fromDate) {
      setFromDate(date);
    } else if (!toDate) {
      setToDate(date);
      onSelectDeliveryTimeDates([fromDate, date]);
      pickerRef.current.close();
    }
  };

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
      startIcon={<PlusIcon />}
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
            Object.fromEntries(allColumnKeys.map((key) => [key, true]))
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
                      : () => navigate(`/${documentPath}?isNewCreation=true`)
                  )}
              </div>
            </div>
            {/* search */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <SearchInputComponent
                searchInputStyle={{ width: "20vw" }}
                filtersButton={
                  <InputAdornment position="start">
                    <div>
                      <IconButton onClick={handleClick}>
                        <TuneIcon />
                        {Object.keys(router.query).filter(
                          (key) => key !== "pageNumber"
                        ).length > 0 && (
                          <div
                            style={{ position: "absolute", top: -5, right: -1 }}
                          >
                            <DotIcon />
                          </div>
                        )}
                      </IconButton>
                      <GoMakeMenu
                        handleClose={handleClose}
                        open={open}
                        anchorEl={anchorEl}
                      >
                        <div style={classes.filtersContainer}>
                          <div style={classes.selectedFilterContainer}>
                            <div style={classes.statusFilterContainer}>
                              <div style={classes.filterLabelStyle}>
                                {isPurchaseDocument
                                  ? t("reports.supplier")
                                  : t("productionFloor.customer")}
                              </div>
                              <ClientAutocomplete
                                key={customerId?.id}
                                clientType={
                                  isPurchaseDocument
                                    ? CLIENT_TYPE.SUPPLIER
                                    : CLIENT_TYPE.CUSTOMER
                                }
                                options={renderOptions() ? renderOptions() : []}
                                getOptionLabel={(option: any) =>
                                  `${option.name}`
                                }
                                onChangeTextField={checkWhatRenderArray}
                                style={classes.textInputStyle}
                                onChange={(e: any, value: any) => {
                                  setCustomerId(value);
                                }}
                                value={customerId}
                                loading={isFetching}
                              />
                            </div>
                            <div style={classes.statusFilterContainer}>
                              <div style={classes.filterLabelStyle}>
                                {t("sales.quote.agent")}
                              </div>
                              <GoMakeAutoComplate
                                key={agentId?.id}
                                options={agentsCategories}
                                style={classes.textInputStyle}
                                getOptionLabel={(option: any) => option.label}
                                placeholder={t("sales.quote.ChooseAgent")}
                                onChange={(e: any, value: any) => {
                                  setAgentId(value);
                                }}
                                value={agentId}
                              />
                            </div>
                            {isQuote && (
                              <div style={classes.statusFilterContainer}>
                                <div style={classes.filterLabelStyle}>
                                  {t("sales.quote.status")}
                                </div>
                                <GoMakeAutoComplate
                                  key={statusId?.value}
                                  options={quoteStatuses}
                                  style={classes.textInputStyle}
                                  getOptionLabel={(option: any) => option.label}
                                  placeholder={t("sales.quote.chooseStatus")}
                                  onChange={(e: any, value: any) => {
                                    setPage(1);
                                    setStatusId(value);
                                  }}
                                  value={statusId}
                                />
                              </div>
                            )}
                            {isQuote && (
                              <div style={classes.statusFilterContainer}>
                                <div style={classes.filterLabelStyle}>
                                  {t("sales.quote.approvalStatus")}
                                </div>
                                <GoMakeAutoComplate
                                  key={approvalStatusId?.value}
                                  options={approvalStatuses}
                                  style={classes.textInputStyle}
                                  getOptionLabel={(option: any) => option.label}
                                  placeholder={t(
                                    "sales.quote.chooseApprovalStatus"
                                  )}
                                  onChange={(e: any, value: any) => {
                                    setPage(1);
                                    setApprovalStatusId(value);
                                  }}
                                  value={approvalStatusId}
                                />
                              </div>
                            )}
                            {isOrder && (
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>
                                  {t("boardMissions.productionStatus")}
                                </h3>
                                <GoMakeAutoComplate
                                  key={productionStatus?.value}
                                  options={productionStatuses}
                                  style={classes.textInputStyle}
                                  placeholder={t(
                                    "boardMissions.productionStatus"
                                  )}
                                  onChange={handleProductionStatusChange}
                                  value={productionStatus}
                                />
                              </div>
                            )}
                            {!isQuote && (
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>
                                  {t("sales.quote.accountingStatus")}
                                </h3>
                                <GoMakeAutoComplate
                                  key={accountingStatus?.value}
                                  options={accountingStatuses}
                                  style={classes.textInputStyle}
                                  placeholder={t(
                                    "sales.quote.accountingStatus"
                                  )}
                                  onChange={handleAccountingStatusChange}
                                  value={accountingStatus}
                                />
                              </div>
                            )}
                            {(isOrder || isDeliveryNote || isInvoice) && (
                              <div style={classes.statusFilterContainer}>
                                <div style={classes.filterLabelStyle}>
                                  {t("sales.documentDeliveries.deliveryStatus")}
                                </div>
                                <GoMakeAutoComplate
                                  key={deliveryStatus?.value}
                                  options={deliveryStatuses}
                                  style={classes.textInputStyle}
                                  placeholder={t(
                                    "sales.documentDeliveries.deliveryStatus"
                                  )}
                                  onChange={(e: any, value: any) => {
                                    setDeliveryStatus(value);
                                  }}
                                  value={deliveryStatus}
                                />
                              </div>
                            )}
                            {documentType !== DOCUMENT_TYPE.purchaseInvoice &&
                              documentType !==
                                DOCUMENT_TYPE.purchaseInvoiceRefund &&
                              documentType !== DOCUMENT_TYPE.purchaseOrder &&
                              documentType !== DOCUMENT_TYPE.receipt && (
                                <div style={classes.statusFilterContainer}>
                                  <h3 style={classes.filterLabelStyle}>
                                    {t("boardMissions.products")}
                                  </h3>
                                  <GoMakeMultiSelect
                                    onChange={handleMultiSelectChange}
                                    style={classes.textInputStyle}
                                    options={productsList}
                                    values={productIds}
                                    placeholder={t(
                                      "boardMissions.selectProducts"
                                    )}
                                  />
                                </div>
                              )}
                            {isOrder && (
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>
                                  {t("sales.quote.canceledOrders")}
                                </h3>
                                <SecondSwitch
                                  checked={isCanceledState}
                                  onChange={(e) => {
                                    setIsCanceledState(e.target.checked);
                                  }}
                                />
                              </div>
                            )}
                            {(isReceipt || isSupplierPayments) && (
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>
                                  {t("sales.quote.paymentType")}
                                </h3>
                                <GoMakeAutoComplate
                                  key={paymentType?.value}
                                  options={typeOfPayments}
                                  style={classes.textInputStyle}
                                  getOptionLabel={(option: any) => option.label}
                                  placeholder={t("sales.quote.paymentType")}
                                  onChange={handlePaymentTypeChange}
                                  value={paymentType}
                                />
                              </div>
                            )}
                            {isOrder && (
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>
                                  {t("sales.quote.pausedOrders")}
                                </h3>
                                <SecondSwitch
                                  checked={isPausedOrders}
                                  onChange={(e) => {
                                    setIsPausedOrders(e.target.checked);
                                  }}
                                />
                              </div>
                            )}
                            {documentType !== DOCUMENT_TYPE.purchaseInvoice &&
                              documentType !==
                                DOCUMENT_TYPE.purchaseInvoiceRefund &&
                              documentType !== DOCUMENT_TYPE.purchaseOrder && (
                                <div
                                  style={{
                                    ...classes.statusFilterContainer,
                                    width: "fit-content",
                                  }}
                                >
                                  <div style={classes.filterLabelStyle}>
                                    {t("sales.quote.priceRange")}
                                  </div>
                                  <div style={classes.priceDivStyle}>
                                    <GomakeTextInput
                                      onChange={handleMinPriceChange}
                                      value={minPrice}
                                      type={"number"}
                                      style={{
                                        ...classes.textInputStyle,
                                        height: "40px",
                                      }}
                                      placeholder={t("sales.quote.minPrice")}
                                    />
                                    -
                                    <GomakeTextInput
                                      onChange={handleMaxPriceChange}
                                      value={maxPrice}
                                      type={"number"}
                                      style={{
                                        ...classes.textInputStyle,
                                        height: "40px",
                                      }}
                                      placeholder={t("sales.quote.maxPrice")}
                                    />
                                  </div>
                                </div>
                              )}
                            <div style={classes.statusFilterContainer}>
                              <h3 style={classes.filterLabelStyle}>
                                {t("boardMissions.dateRange")}
                              </h3>
                              <GlobalStyle RTL={RTL} />
                              <DateRangePicker
                                ref={pickerRef}
                                onChange={onSelectDeliveryTimeDates}
                                onSelect={handleSelect}
                                value={
                                  fromDate && toDate ? [fromDate, toDate] : null
                                }
                                // oneTap
                                ranges={predefinedRanges}
                              />
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              width: "100%",
                              gap: "10px",
                            }}
                          >
                            <div style={classes.buttonsFilterContainer}>
                              <div style={classes.filterLabelStyle} />
                              <GomakePrimaryButton
                                style={classes.clearBtnStyle}
                                onClick={onClickClearFilter}
                              >
                                {t("sales.quote.clear")}
                              </GomakePrimaryButton>
                            </div>
                            <div style={classes.buttonsFilterContainer}>
                              <div style={classes.filterLabelStyle} />
                              <GomakePrimaryButton
                                style={classes.searchBtnStyle}
                                onClick={onClickSearchFilter}
                              >
                                {t("sales.quote.search")}
                              </GomakePrimaryButton>
                            </div>
                          </div>
                        </div>
                      </GoMakeMenu>
                    </div>
                  </InputAdornment>
                }
                onChange={onChangeDocumentSearch}
                value={patternSearch}
                inputRef={searchInputRef}
              />

              <Stack direction={"row"} gap={1}>
                {columnsReady && (
                  <DocumentsColumnSettingsMenu
                    tableKey={tableKey}
                    documentType={documentType}
                  />
                )}
                <ExcelMenu
                  onGenerateReportClick={onOpenAddRuleModal}
                  onExportTableClick={ExportDocumentTableToExcel}
                  onExportTablePdfClick={ExportDocumentTableToPdf}
                />
              </Stack>
            </div>
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
            onChangePageSize={handlePageSizeChange}
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
          variant="ClassicTable"
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
        />
      )}
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
        title={t("sales.quote.printDeliveryNoteWithPrices")}
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
            : "customers.modal.closeOrderAsInvoice"
        }
        subTitle={"customers.modal.thisOrderIsAlreadyInProcess"}
        yesBtn={
          isSelectedCLoseAsDeliveryNote
            ? t("customers.modal.closeAsDeliveryNote")
            : t("customers.modal.closeAsInvoice")
        }
        openModal={openChangeProductionStatusModal}
        onClose={onClickCloseChangeProductionStatusModal}
        onClickDelete={
          isMoveToReady
            ? () => moveOrderToReady(false)
            : () => {
                if (isSelectedCLoseAsDeliveryNote) {
                  const path = `/deliveryNote?isNewCreation=true&orderId=${selectedDocument?.id}`;
                  window.open(path, "_blank");
                } else {
                  const path = isOrder
                    ? `/invoice?isNewCreation=true&orderId=${selectedDocument?.id}`
                    : `/invoice?isNewCreation=true&deliveryNoteId=${selectedDocument?.id}`;
                  window.open(path, "_blank");
                }
              }
        }
      >
        <Stack alignItems={"center"}>
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
      />
    </>
  );
};

export { QuotesListPageWidget };
