import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HeaderTitle } from "@/widgets";
import { DocumentLogsWidget } from "./widgets/documents-logs-widget/logs-widget";
import { DOCUMENT_TYPE } from "./enums";
import { Button, Stack } from "@mui/material";
import { CardsSection, ICard } from "./widgets/statistics-section/statistics-sections";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { ExcelSheetIcon } from "@/icons";
import { AddRuleModal } from "../products/profits-new/widgets/add-rule-modal";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRecoilValue } from "recoil";
import { employeesListsState } from "./states";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { useEffect, } from "react";
import { IconButton } from "@mui/material";
import { GoMakeMenu } from "@/components";
import { InputAdornment } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import { CardComponent } from "./widgets/statistics-section/card";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { GoMakeCurrency } from "@/icons/go-make-currency";
import { QuoteStatuses } from "@/widgets/quote-new/total-price-and-vat/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { isValidCustomer } from "@/utils/helpers";
import { useRouter } from "next/router";
import { CloseOrderNotesModal } from "../products/profits-new/widgets/close-order-notes-modal";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isFromHomePage?: boolean;
}
const QuotesListPageWidget = ({
  documentType,
  isFromHomePage = false,
}: IProps) => {
  const { classes } = useStyle();
  const { secondColor, } = useGomakeTheme();
  const employeeListValue = useRecoilValue<string[]>(employeesListsState);
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
    tableHeaders,
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
    resetDatePicker,
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
    selectedQuoteItemValue,
    onClickCloseCloseOrderModal,
    openCloseOrderModal,
    CloseDocument,
    selectedOrder,
    onClickOpenCloseOrderModal,
  } = useQuotes(documentType,isFromHomePage);

  const router = useRouter();

  useEffect(() => {
    if (router.query.orderNumber) {
      setPatternSearch(router.query.orderNumber as string);
    }
    else if (router.query.documentNumber) {
      setPatternSearch(router.query.documentNumber as string);
    }

  }, [router])

  useEffect(() => {
    getAllProducts();
  }, []);

  const getValueByKey = (statistics: ICard[], key: string) => {
    const card = statistics.find((item) => item.key === key);
    return card ? card.value : "";
  };
  
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
            <div style={classes.headerStyle}>
              <HeaderTitle title={documentLabel} marginTop={1} marginBottom={1} />
              <div style={classes.rowStyle}>
                {(documentType === DOCUMENT_TYPE.quote) && <CardsSection statistics={allStatistics} activeCard={activeCard} onClick={onclickCreateNew} onClickCard={handleCardClick} onSecondClickCard={handleSecondCardClick} />}
                {documentType === DOCUMENT_TYPE.order &&
                  <>
                    <CardComponent text={t("sales.quote.totalPrice")} number={getValueByKey(allStatistics, "totalPrice")} textColor={secondColor(100)} icon={<GoMakeCurrency color={secondColor(100)} />} />
                    <Button style={classes.createNew} onClick={onclickCreateNew} startIcon={<AddCircleOutlineIcon style={{ color: 'black', fontSize: "24px" }} />}>{t("sales.quote.createNew")}</Button>
                  </>
                }
                {(documentType !== DOCUMENT_TYPE.quote && documentType !== DOCUMENT_TYPE.order) &&
                  <Button
                    style={classes.createNew}
                    onClick={() => navigate(`/${documentPath}?isNewCreation=true`)}
                    startIcon={<AddCircleOutlineIcon style={{ color: 'black', fontSize: "24px" }} />}>
                    {t("sales.quote.createNew")}
                  </Button>
                }
              </div>
            </div>

            {/* search */}

            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <SearchInputComponent
                searchInputStyle={{ width: "20vw" }}
                filtersButton={
                  <InputAdornment position="start">
                    <div>
                      <IconButton onClick={handleClick}>
                        <TuneIcon />
                      </IconButton>
                      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl} >
                        <div style={classes.filtersContainer}>
                          <div style={classes.selectedFilterContainer}>
                            <div style={classes.statusFilterContainer}>
                              <div style={classes.filterLabelStyle}>
                                {t("sales.quote.customer")}
                              </div>
                              <GoMakeAutoComplate
                                key={customerId?.id}
                                options={renderOptions() ? renderOptions() : []}
                                getOptionLabel={(option: any) => `${option.name}`}
                                onChangeTextField={checkWhatRenderArray}
                                style={classes.textInputStyle}
                                placeholder={t("sales.quote.chooseCustomer")}
                                onChange={(e: any, value: any) => {
                                  setCustomerId(value);
                                }}
                                value={customerId}
                                withArrow={true}
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
                                withArrow={true}
                              />
                            </div>
                            {documentType === DOCUMENT_TYPE.quote &&
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
                                  withArrow={true}
                                />
                              </div>
                            }
                            {documentType === DOCUMENT_TYPE.order &&
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>{t("boardMissions.productionStatus")}</h3>
                                <GoMakeAutoComplate
                                  key={productionStatus?.value}
                                  options={productionStatuses}
                                  style={classes.textInputStyle}
                                  placeholder={t("boardMissions.productionStatus")}
                                  onChange={handleProductionStatusChange}
                                  value={productionStatus}
                                  withArrow={true}
                                />
                              </div>
                            }
                            {documentType !== DOCUMENT_TYPE.quote &&
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>{t("sales.quote.accountingStatus")}</h3>
                                <GoMakeAutoComplate
                                  key={accountingStatus?.value}
                                  options={accountingStatuses}
                                  style={classes.textInputStyle}
                                  placeholder={t("sales.quote.accountingStatus")}
                                  onChange={handleAccountingStatusChange}
                                  value={accountingStatus}
                                  withArrow={true}
                                />
                              </div>
                            }
                            {documentType !== DOCUMENT_TYPE.purchaseInvoice && documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund && documentType !== DOCUMENT_TYPE.purchaseOrder && documentType !== DOCUMENT_TYPE.receipt &&
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>{t("boardMissions.products")}</h3>
                                <GoMakeMultiSelect
                                  onChange={handleMultiSelectChange}
                                  style={classes.textInputStyle}
                                  options={productsList}
                                  values={productIds}
                                  placeholder={t("boardMissions.selectProducts")} />
                              </div>}
                            {documentType === DOCUMENT_TYPE.order &&
                              <div style={classes.statusFilterContainer}>
                                <h3 style={classes.filterLabelStyle}>{t("sales.quote.canceledOrders")}</h3>
                                <SecondSwitch
                                  checked={isCanceledState}
                                  onChange={(e) => { setIsCanceledState(e.target.checked) }}
                                />
                              </div>
                            }
                            {documentType !== DOCUMENT_TYPE.purchaseInvoice && documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund && documentType !== DOCUMENT_TYPE.purchaseOrder &&
                              <div style={classes.statusFilterContainer}>
                                <div style={classes.filterLabelStyle}>{t("sales.quote.priceRange")}</div>
                                <div style={classes.priceDivStyle}>
                                  <GomakeTextInput
                                    onChange={handleMinPriceChange}
                                    value={minPrice}
                                    type={'number'}
                                    style={{ ...classes.textInputStyle, height: '40px' }}
                                    placeholder={t("sales.quote.minPrice")}
                                  />
                                  -
                                  <GomakeTextInput
                                    onChange={handleMaxPriceChange}
                                    value={maxPrice}
                                    type={'number'}
                                    style={{ ...classes.textInputStyle, height: '40px' }}
                                    placeholder={t("sales.quote.maxPrice")}
                                  />
                                </div></div>}
                            <div style={classes.statusFilterContainer}>
                              <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                              <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
                            </div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%", gap: "10px" }}>

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
                onChange={(e) => {
                  setPage(1)
                  setPatternSearch(e)
                }}
                value={patternSearch}
              />
              <div style={{ cursor: "pointer" }} onClick={onOpenAddRuleModal}>
                <ExcelSheetIcon />
              </div>
            </div>

            {/* search */}
            <PrimaryTable
              stickyFirstCol={false}
              stickyHeader={true}
              maxHeight={650}
              rows={allQuotes}
              headers={tableHeaders}
            />
          </div>
          <GoMakePagination
            onChangePageNumber={(event, value) => setPage(value)}
            onChangePageSize={handlePageSizeChange}
            page={page}
            setPage={setPage}
            pagesCount={pagesCount}
            pageSize={pageSize}
          />
        </Stack>
      )}
      {isFromHomePage && (
        <PrimaryTable
          stickyHeader={true}
          maxHeight={400}
          rows={allDocuments}
          headers={tableHomeHeader}
          variant="ClassicTable"
          withoutShadow={true}
        />
      )}
      <GoMakeDeleteModal
        icon={<WarningAmberIcon style={classes.warningIconStyle} />}
        title={t("sales.quote.titleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openModal}
        onClose={onClickCloseModal}
        subTitle={t("sales.quote.subTitleModal")}
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
          employeesCategories={employeeListValue}
        />
      </GoMakeModal>
      {!isFromHomePage && <AddRuleModal
        openModal={openAddRule}
        onCloseModal={onCloseAddRuleModal}
        isQuoteWidge={true}
        filterData={filterData}
      />}
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
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
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCancelModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openPriceCancelModal}
        onClose={onClickClosePriceModal}
        subTitle={t("sales.quote.subTitleCancelModal")}
        cancelBtn={t("sales.quote.cancelBtn")}
        onClickDelete={() => updateCancelQuote(QuoteStatuses.CANCELED_PRICE)}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
        title={t("sales.quote.titleCloseModal")}
        yesBtn={t("sales.quote.yesBtn")}
        openModal={openCloseOrderModal}
        onClose={onClickCloseCloseOrderModal}
        subTitle={t("sales.quote.subTitleCloseModal")}
        onClickDelete={() => CloseDocument(selectedOrder)}
      />
      <GoMakeDeleteModal
        icon={
          <WarningAmberIcon style={{ width: 60, height: 60, color: "red" }} />
        }
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
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Edit}
        codeFlag={true}
        typeClient={CLIENT_TYPE.CUSTOMER}
        isgetAllCustomers={false}
        openModal={showCustomerModal}
        modalTitle={t("customers.modal.editTitle")}
        onClose={() => setShowCustomerModal(false)}
        customer={customerForEdit}
        setCustomer={setCustomerForEdit}
        showUpdateButton={true}
      />
      <CloseOrderNotesModal
        onClose={onClickCloseCloseOrderNotesModal}
        openModal={openCloseOrderNotesModal}
        quoteItemValue={selectedQuoteItemValue}
        onClickCloseOrder={() => onClickOpenCloseOrderModal(selectedOrder)}
        documentType={documentType}


      />
    </>
  );
};

export { QuotesListPageWidget };