import {
  FilterSectionComponent,
  GoMakeAutoComplate,
  GomakeTextInput,
  GoMakeTextInputIcon,
  IFilterItem,
  SecondSwitch,
} from "@/components";
import { useTranslation } from "react-i18next";
import { SecondaryButton } from "@/components/button/secondary-button";
import { SearchIcon } from "@/icons";
import { InputAdornment } from "@mui/material";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { ControlledDateRangePicker } from "@/components/datepicker/controlled-date-range-picker";
import { FONT_FAMILY } from "@/utils/font-family";

interface IDocumentsFilterSectionProps {
  // Customer/Supplier filter
  customerId: any;
  setCustomerId: (value: any) => void;
  renderOptions: () => any[];
  checkWhatRenderArray: any;
  isFetching: boolean;
  isPurchaseDocument: boolean;

  // Agent filter
  agentId: any;
  setAgentId: (value: any) => void;
  agentsCategories: any[];

  // Status filters
  isQuote: boolean;
  statusId: any;
  setStatusId: (value: any) => void;
  setPage: (page: number) => void;
  quoteStatuses: any[];

  // Approval status
  approvalStatusId: any;
  setApprovalStatusId: (value: any) => void;
  approvalStatuses: any[];

  // Production status
  isOrder: boolean;
  productionStatus: any;
  handleProductionStatusChange: (e: any, value: any) => void;
  productionStatuses: any[];

  // Accounting status
  accountingStatus: any;
  handleAccountingStatusChange: (e: any, value: any) => void;
  accountingStatuses: any[];

  // Delivery status
  isDeliveryNote: boolean;
  isProformaInvoice: boolean;
  isInvoice: boolean;
  deliveryStatus: any;
  setDeliveryStatus: (value: any) => void;
  deliveryStatuses: any[];

  // Products filter
  documentType: any;
  DOCUMENT_TYPE: any;
  handleMultiSelectChange: (value: any) => void;
  productsList: any[];
  productIds: any[];

  // Currency filter
  currencyFilter: any;
  setCurrencyFilter: (value: any) => void;
  currencies: any[];

  // Canceled orders
  isPurchaseOrder: boolean;
  isCanceledState: boolean;
  setIsCanceledState: (value: boolean) => void;

  // Payment type
  isReceipt: boolean;
  isSupplierPayments: boolean;
  paymentType: any;
  handlePaymentTypeChange: (e: any, value: any) => void;
  typeOfPayments: any[];

  // Paused orders
  isPausedOrders: boolean;
  setIsPausedOrders: (value: boolean) => void;

  // Price range
  minPrice: string;
  maxPrice: string;
  handleMinPriceChange: (e: any) => void;
  handleMaxPriceChange: (e: any) => void;

  // Date range
  fromDate: Date | null;
  toDate: Date | null;
  onSelectDeliveryTimeDates: (dates: any) => void;

  // Check Due Date range (for receipts and supplier payments)
  checkFromDate: Date | null;
  checkToDate: Date | null;
  onSelectCheckDueDateRange: (dates: any) => void;

  // Search
  patternSearch: string;
  onChangeDocumentSearch: (value: string) => void;

  // Actions
  onClickClearFilter: () => void;
  onClickSearchFilter: () => void;

  // Menu Components
  columnsReady: boolean;
  tableKey: string;
  onOpenAddRuleModal: () => void;
  ExportDocumentTableToExcel: () => void;
  ExportDocumentTableToPdf: () => void;
  DocumentsColumnSettingsMenu: React.ComponentType<any>;
  ExcelMenu: React.ComponentType<any>;

  // Styles
  classes: any;
}

const DocumentsFilterSection: React.FC<IDocumentsFilterSectionProps> = ({
  customerId,
  setCustomerId,
  renderOptions,
  checkWhatRenderArray,
  isFetching,
  isPurchaseDocument,
  agentId,
  setAgentId,
  agentsCategories,
  isQuote,
  statusId,
  setStatusId,
  setPage,
  quoteStatuses,
  approvalStatusId,
  setApprovalStatusId,
  approvalStatuses,
  isOrder,
  productionStatus,
  handleProductionStatusChange,
  productionStatuses,
  accountingStatus,
  handleAccountingStatusChange,
  accountingStatuses,
  isDeliveryNote,
  isProformaInvoice,
  isInvoice,
  deliveryStatus,
  setDeliveryStatus,
  deliveryStatuses,
  documentType,
  DOCUMENT_TYPE,
  handleMultiSelectChange,
  productsList,
  productIds,
  currencyFilter,
  setCurrencyFilter,
  currencies,
  isPurchaseOrder,
  isCanceledState,
  setIsCanceledState,
  isReceipt,
  isSupplierPayments,
  paymentType,
  handlePaymentTypeChange,
  typeOfPayments,
  isPausedOrders,
  setIsPausedOrders,
  minPrice,
  maxPrice,
  handleMinPriceChange,
  handleMaxPriceChange,
  fromDate,
  toDate,
  onSelectDeliveryTimeDates,
  checkFromDate,
  checkToDate,
  onSelectCheckDueDateRange,
  patternSearch,
  onChangeDocumentSearch,
  onClickSearchFilter,
  onClickClearFilter,
  columnsReady,
  tableKey,
  onOpenAddRuleModal,
  ExportDocumentTableToExcel,
  ExportDocumentTableToPdf,
  DocumentsColumnSettingsMenu,
  ExcelMenu,
  classes,
}) => {
  const { t } = useTranslation();

  // Check if there are active filters
  const hasActiveFilters =
    customerId ||
    agentId ||
    statusId ||
    approvalStatusId ||
    productionStatus ||
    accountingStatus ||
    deliveryStatus ||
    productIds?.length > 0 ||
    currencyFilter ||
    isCanceledState ||
    paymentType ||
    isPausedOrders ||
    minPrice ||
    maxPrice ||
    fromDate ||
    toDate ||
    checkFromDate ||
    checkToDate;

  const filters: IFilterItem[] = [
    {
      id: "search",
      label: t("header.search"),
      component: (
        <GoMakeTextInputIcon
          onChange={(e) => {
            const trimmedValue = e.target.value.trimStart();
            onChangeDocumentSearch(trimmedValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClickSearchFilter();
            }
          }}
          sx={{
            "& .MuiInputAdornment-root": {
              marginRight: "0px",
            },
          }}
          style={classes.searchInputStyle}
          placeholder={t("header.search")}
          value={patternSearch}
          startAdornment={
            <InputAdornment position="start">
              <div style={classes.iconStyle}>
                <SearchIcon width={20} height={20} />
              </div>
            </InputAdornment>
          }
        />
      ),
    },
    // Customer/Supplier filter
    {
      id: "customer",
      label: isPurchaseDocument
        ? t("reports.supplier")
        : t("productionFloor.customer"),
      component: (
        <ClientAutocomplete
          key={customerId?.id}
          clientType={
            isPurchaseDocument ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
          }
          options={renderOptions() ? renderOptions() : []}
          getOptionLabel={(option: any) => `${option.name}`}
          onChangeTextField={checkWhatRenderArray}
          style={classes.textInputStyle}
          onChange={(e: any, value: any) => {
            setCustomerId(value);
          }}
          value={customerId}
          loading={isFetching}
        />
      ),
    },
    // Agent filter
    {
      id: "agent",
      label: t("sales.quote.agent"),
      component: (
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
      ),
    },
    // Quote status filter
    ...(isQuote
      ? [
          {
            id: "status",
            label: t("sales.quote.status"),
            component: (
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
            ),
          },
        ]
      : []),
    // Approval status filter
    ...(isQuote
      ? [
          {
            id: "approvalStatus",
            label: t("sales.quote.approvalStatus"),
            component: (
              <GoMakeAutoComplate
                key={approvalStatusId?.value}
                options={approvalStatuses}
                style={classes.textInputStyle}
                getOptionLabel={(option: any) => option.label}
                placeholder={t("sales.quote.chooseApprovalStatus")}
                onChange={(e: any, value: any) => {
                  setPage(1);
                  setApprovalStatusId(value);
                }}
                value={approvalStatusId}
              />
            ),
          },
        ]
      : []),
    // Production status filter
    ...(isOrder
      ? [
          {
            id: "productionStatus",
            label: t("boardMissions.productionStatus"),
            component: (
              <GoMakeAutoComplate
                key={productionStatus?.value}
                options={productionStatuses}
                style={classes.textInputStyle}
                placeholder={t("boardMissions.productionStatus")}
                onChange={handleProductionStatusChange}
                value={productionStatus}
              />
            ),
          },
        ]
      : []),
    // Accounting status filter
    ...(!isQuote
      ? [
          {
            id: "accountingStatus",
            label: t("sales.quote.accountingStatus"),
            component: (
              <GoMakeAutoComplate
                key={accountingStatus?.value}
                options={accountingStatuses}
                style={classes.textInputStyle}
                placeholder={t("sales.quote.accountingStatus")}
                onChange={handleAccountingStatusChange}
                value={accountingStatus}
              />
            ),
          },
        ]
      : []),
    // Delivery status filter
    ...(isOrder || isDeliveryNote || isProformaInvoice || isInvoice
      ? [
          {
            id: "deliveryStatus",
            label: t("sales.documentDeliveries.deliveryStatus"),
            component: (
              <GoMakeAutoComplate
                key={deliveryStatus?.value}
                options={deliveryStatuses}
                style={classes.textInputStyle}
                placeholder={t("sales.documentDeliveries.deliveryStatus")}
                onChange={(e: any, value: any) => {
                  setDeliveryStatus(value);
                }}
                value={deliveryStatus}
              />
            ),
          },
        ]
      : []),
    // Products filter
    ...(documentType !== DOCUMENT_TYPE.purchaseInvoice &&
    documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund &&
    documentType !== DOCUMENT_TYPE.purchaseOrder &&
    documentType !== DOCUMENT_TYPE.receipt
      ? [
          {
            id: "products",
            label: t("boardMissions.products"),
            component: (
              <GoMakeMultiSelect
                onChange={handleMultiSelectChange}
                style={classes.textInputStyle}
                options={productsList}
                values={productIds}
                placeholder={t("boardMissions.selectProducts")}
              />
            ),
          },
        ]
      : []),
    // Currency filter
    {
      id: "currency",
      label: t("sales.quote.currency"),
      component: (
        <GoMakeAutoComplate
          key={currencyFilter?.value}
          options={currencies}
          style={classes.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.chooseCurrency")}
          onChange={(e: any, value: any) => {
            setCurrencyFilter(value);
          }}
          value={currencyFilter}
        />
      ),
    },
    // Canceled orders filter
    ...(isOrder || isPurchaseOrder
      ? [
          {
            id: "canceledOrders",
            label: isPurchaseOrder
              ? t("sales.quote.canceledPurchaseOrders")
              : t("sales.quote.canceledOrders"),
            component: (
              <SecondSwitch
                checked={isCanceledState}
                onChange={(e) => {
                  setIsCanceledState(e.target.checked);
                }}
              />
            ),
          },
        ]
      : []),
    // Payment type filter
    ...(isReceipt || isSupplierPayments
      ? [
          {
            id: "paymentType",
            label: t("sales.quote.paymentType"),
            component: (
              <GoMakeAutoComplate
                key={paymentType?.value}
                options={typeOfPayments}
                style={classes.textInputStyle}
                getOptionLabel={(option: any) => option.label}
                placeholder={t("sales.quote.paymentType")}
                onChange={handlePaymentTypeChange}
                value={paymentType}
              />
            ),
          },
        ]
      : []),
    // Paused orders filter
    ...(isOrder
      ? [
          {
            id: "pausedOrders",
            label: t("sales.quote.pausedOrders"),
            component: (
              <SecondSwitch
                checked={isPausedOrders}
                onChange={(e) => {
                  setIsPausedOrders(e.target.checked);
                }}
              />
            ),
          },
        ]
      : []),
    // Price range filter
    ...(documentType !== DOCUMENT_TYPE.purchaseInvoice &&
    documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund &&
    documentType !== DOCUMENT_TYPE.purchaseOrder
      ? [
          {
            id: "priceRange",
            label: t("sales.quote.priceRange"),
            width: "lg" as "lg",
            component: (
              <div style={classes.priceDivStyle}>
                <GomakeTextInput
                  onChange={handleMinPriceChange}
                  value={minPrice}
                  type={"number"}
                  style={{
                    ...classes.textInputStyle,
                    width: "auto",
                    height: "40px",
                    flex: 1,
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
                    width: "auto",
                    height: "40px",
                    flex: 1,
                  }}
                  placeholder={t("sales.quote.maxPrice")}
                />
              </div>
            ),
          },
        ]
      : []),
    // Date range filter
    {
      id: "dateRange",
      label: t("boardMissions.dateRange"),
      component: (
        <ControlledDateRangePicker
          startDate={fromDate}
          endDate={toDate}
          onChange={(start, end) => {
            onSelectDeliveryTimeDates([start, end]);
          }}
          allowClear={true}
          allowManualInput={true}
          buttonStyle={{
            borderRadius:
              "var(--theme-input-border-radius, var(--theme-radius-md, 4px))",
            border:
              "var(--theme-input-border, 1px solid var(--theme-border-color, transparent))",
            boxShadow:
              "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
            WebkitBoxShadow:
              "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
          }}
          textStyle={{
            ...FONT_FAMILY.Heebo(500, 13),
          }}
        />
      ),
    },
    // Check Due Date range filter (for receipts and supplier payments)
    ...(isReceipt || isSupplierPayments
      ? [
          {
            id: "checkDueDateRange",
            label: t("supplierPayments.checkDueDateRange"),
            component: (
              <ControlledDateRangePicker
                startDate={checkFromDate}
                endDate={checkToDate}
                onChange={(start, end) => {
                  onSelectCheckDueDateRange([start, end]);
                }}
                allowClear={true}
                allowManualInput={true}
                buttonStyle={{
                  borderRadius:
                    "var(--theme-input-border-radius, var(--theme-radius-md, 4px))",
                  border:
                    "var(--theme-input-border, 1px solid var(--theme-border-color, transparent))",
                  boxShadow:
                    "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
                  WebkitBoxShadow:
                    "var(--theme-input-shadow, 0px 1px 10px rgba(0, 0, 0, 0.08))",
                }}
                textStyle={{
                  ...FONT_FAMILY.Heebo(500, 13),
                }}
              />
            ),
          },
        ]
      : []),
  ];

  const actionButtons = (
    <>
      <SecondaryButton variant="contained" onClick={onClickSearchFilter}>
        {t("sales.quote.search")}
      </SecondaryButton>
      <SecondaryButton variant="outlined" onClick={onClickClearFilter}>
        {t("sales.quote.clear")}
      </SecondaryButton>
    </>
  );

  const tableActionButtons = (
    <>
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
        documentType={documentType}
      />
    </>
  );

  return (
    <FilterSectionComponent
      filters={filters}
      hasActiveFilters={hasActiveFilters}
      actionButtons={actionButtons}
      tableActionButtons={tableActionButtons}
    />
  );
};

export { DocumentsFilterSection };
