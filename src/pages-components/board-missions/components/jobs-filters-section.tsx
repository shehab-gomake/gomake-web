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
import ProductMultiSelect from "@/components/auto-complete/product-multi-select";
import { BoardMissionsColumnSettingsMenu } from "../widgets/board-missions-column-settings-menu/board-missions-column-settings-menu";
import { ExcelMenu } from "@/pages-components/quotes/widgets/excel-menu/excel-menu";
import { FONT_FAMILY } from "@/utils/font-family";

interface IJobsFiltersSectionProps {
  // Customer/Supplier filter
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: any;
  isFetching: boolean;
  isPurchaseJobs: boolean;
  handleCustomerChange: (e: any, value: any) => void;

  // Agent filter
  agent: any;
  agentsCategories: any[];
  handleAgentChange: (e: any, value: any) => void;

  // Production status
  status: any;
  handleStatusChange: (e: any, value: any) => void;
  productionStatuses: any[];

  // Status filters
  orderStatus: any;
  handleOrderStatusChange: (e: any, value: any) => void;
  orderStatuses: any[];

  // Proof types
  proofTypes: any;
  exampleTypeValues: any;
  handleProofTypesChange: (e: any, value: any) => void;

  // Is printed filter
  isPrintedState: boolean;
  setIsPrintedState: (value: boolean) => void;
  isPrintHouseUsePrintNode: boolean;

  // Is Quality fix job filter
  isQualityFixJob: boolean | null;
  setIsQualityFixJob: (value: boolean | null) => void;

  // Products filter
  productsList: any[];
  productIds: any[];
  handleMultiSelectChange: any;

  // Date ranges
  fromDate: any;
  toDate: any;
  onSelectDeliveryTimeDates: (value: any) => void;

  fromDueDate: any;
  toDueDate: any;
  onSelectDueTimeDates: (value: any) => void;

  fromReadyDate: any;
  toReadyDate: any;
  onSelectReadyTimeDates: (value: any) => void;

  // Search
  patternSearch: string;
  onChangeMissionsSearch: (value: string) => void;

  // Actions
  onClickClearFilter: () => void;
  onClickSearchFilter: () => void;

  // Menu Components
  columnsReady: boolean;
  tableKey: string;
  ExportJobsTableToExcel: () => void;
  onGenerateReportClick: () => void;

  // Styles
  classes: any;
}

const JobsFiltersSection = ({
  // Customer/Supplier filter
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  isFetching,
  isPurchaseJobs,
  // Agent filter
  agent,
  agentsCategories,
  handleAgentChange,
  // Production status
  status,
  handleStatusChange,
  productionStatuses,
  // Order Status filters
  orderStatus,
  orderStatuses,
  handleOrderStatusChange,
  // Proof types
  proofTypes,
  exampleTypeValues,
  handleProofTypesChange,
  // Is printed filter
  isPrintedState,
  setIsPrintedState,
  isPrintHouseUsePrintNode,
  // Is Quality fix job filter
  isQualityFixJob,
  setIsQualityFixJob,
  // Products filter
  productsList,
  productIds,
  handleMultiSelectChange,
  // Date ranges
  fromDate,
  toDate,
  onSelectDeliveryTimeDates,
  //Due date
  fromDueDate,
  toDueDate,
  onSelectDueTimeDates,
  // Ready Date
  fromReadyDate,
  toReadyDate,
  onSelectReadyTimeDates,
  // Search
  patternSearch,
  onChangeMissionsSearch,
  // Actions
  onClickClearFilter,
  onClickSearchFilter,
  // Menu Components
  ExportJobsTableToExcel,
  onGenerateReportClick,
  columnsReady,
  tableKey,
  // Styles
  classes,
  hideActionButtons = false,
}) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const filters: IFilterItem[] = [
    {
      id: "search",
      label: t("header.search"),
      component: (
        <GoMakeTextInputIcon
          onChange={(e) => {
            const trimmedValue = e.target.value.trimStart();
            onChangeMissionsSearch(trimmedValue);
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
    {
      id: "customer",
      label: isPurchaseJobs
        ? t("reports.supplier")
        : t("productionFloor.customer"),
      component: (
        <ClientAutocomplete
          key={customer?.id}
          clientType={
            isPurchaseJobs ? CLIENT_TYPE.SUPPLIER : CLIENT_TYPE.CUSTOMER
          }
          options={renderOptions() ? renderOptions() : []}
          onChangeTextField={checkWhatRenderArray}
          getOptionLabel={(option: any) => `${option.name}`}
          style={classes.textInputStyle}
          onChange={handleCustomerChange}
          value={customer}
          withArrow={true}
          loading={isFetching}
        />
      ),
    },
    {
      id: "agent",
      label: t("sales.quote.agent"),
      component: (
        <GoMakeAutoComplate
          key={agent?.id}
          options={agentsCategories}
          style={classes.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.ChooseAgent")}
          onChange={handleAgentChange}
          value={agent}
          withArrow={true}
        />
      ),
    },
    ...(productionStatuses.length > 1
      ? [
          {
            id: "productionStatus",
            label: t("boardMissions.productionStatus"),
            component: (
              <GoMakeAutoComplate
                key={status?.value}
                options={productionStatuses}
                style={classes.textInputStyle}
                placeholder={t("boardMissions.productionStatus")}
                onChange={handleStatusChange}
                value={status}
                withArrow={true}
              />
            ),
          },
        ]
      : []),
    {
      id: "orderStatus",
      label: t("boardMissions.orderStatus"),
      component: (
        <GoMakeAutoComplate
          key={orderStatus?.value}
          options={orderStatuses}
          style={classes.textInputStyle}
          placeholder={t("boardMissions.orderStatus")}
          onChange={handleOrderStatusChange}
          value={orderStatus}
          withArrow={true}
        />
      ),
    },

    {
      id: "proofTypes",
      label: t("products.offsetPrice.admin.proof"),
      component: (
        <GoMakeMultiSelect
          onChange={handleProofTypesChange}
          style={{
            ...classes.textInputForProductsStyle,
            ...(!!isPrintHouseUsePrintNode && {
              width: "100%",
            }),
          }}
          options={
            exampleTypeValues?.map((option) => ({
              label: t(`products.proofTypes.${option.value}`),
              value: option.key,
            })) || []
          }
          values={proofTypes}
          placeholder={t("products.offsetPrice.admin.proof")}
        />
      ),
    },
    ...(isPrintHouseUsePrintNode
      ? [
        {
          id: "isPrinted",
          label: t("boardMissions.isPrinted"),
          component: (
            <GoMakeAutoComplate
              key={
                isPrintedState === null ? "null" : isPrintedState.toString()
              }
              options={[
                { value: true, text: t("modal.yes") },
                { value: false, text: t("modal.no") },
              ]}
              getOptionLabel={(option: any) => option.text}
              placeholder={t("boardMissions.isPrinted")}
              style={classes.textInputStyle}
              onChange={(e, value) => setIsPrintedState(value?.value ?? null)}
              value={
                isPrintedState === null
                  ? null
                  : isPrintedState === true
                    ? { value: true, text: t("modal.yes") }
                    : { value: false, text: t("modal.no") }
              }
              withArrow={true}
            />
          ),
        },
      ]
      : []),
    {
      id: "isQualityFixJob",
      label: t("boardMissions.isQualityFixJob"),
      component: (
        <GoMakeAutoComplate
          key={
            isQualityFixJob === null ? "null" : isQualityFixJob?.toString()
          }
          options={[
            { value: true, text: t("modal.yes") },
            { value: false, text: t("modal.no") },
          ]}
          getOptionLabel={(option: any) => option.text}
          placeholder={t("boardMissions.isQualityFixJob")}
          style={classes.textInputStyle}
          onChange={(e, value) => setIsQualityFixJob(value?.value ?? null)}
          value={
            isQualityFixJob === null
              ? null
              : isQualityFixJob === true
                ? { value: true, text: t("modal.yes") }
                : { value: false, text: t("modal.no") }
          }
          withArrow={true}
        />
      ),
    },
    {
      id: "products",
      label: t("boardMissions.products"),
      width: "md", //or lg
      component: (
        <ProductMultiSelect
          products={productsList}
          selectedProductIds={productIds}
          onProductChange={handleMultiSelectChange}
          placeholder={t("boardMissions.selectProducts")}
          selectStyle={classes.textInputForProductsStyle}
        />
      ),
    },
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
          dateFormat="dd-MM-yyyy"
          buttonStyle={{
            borderRadius: "5px",
          }}
          textStyle={{
            ...FONT_FAMILY.Heebo(500, 13),
          }}
        />
      ),
    },
    {
      id: "dueDate",
      label: t("boardMissions.dueDate"),
      component: (
        <ControlledDateRangePicker
          startDate={fromDueDate}
          endDate={toDueDate}
          onChange={(start, end) => {
            onSelectDueTimeDates([start, end]);
          }}
          allowClear={true}
          allowManualInput={true}
          dateFormat="dd-MM-yyyy"
          buttonStyle={{
            borderRadius: "5px",
          }}
          textStyle={{
            ...FONT_FAMILY.Heebo(500, 13),
          }}
        />
      ),
    },
    {
      id: "readyDate",
      label: t("boardMissions.readyDate"),
      component: (
        <ControlledDateRangePicker
          startDate={fromReadyDate}
          endDate={toReadyDate}
          onChange={(start, end) => {
            onSelectReadyTimeDates([start, end]);
          }}
          allowClear={true}
          allowManualInput={true}
          dateFormat="dd-MM-yyyy"
          buttonStyle={{
            borderRadius: "5px",
          }}
          textStyle={{
            ...FONT_FAMILY.Heebo(500, 13),
          }}
        />
      ),
    },
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
        <BoardMissionsColumnSettingsMenu
          tableKey={tableKey}
          isPurchaseJobs={isPurchaseJobs}
        />
      )}
      <ExcelMenu
        onGenerateReportClick={isPurchaseJobs ? undefined : onGenerateReportClick}
        onExportTableClick={ExportJobsTableToExcel}
        documentType={null}
      />
    </>
  );

  return (
    <FilterSectionComponent
      filters={filters}
      actionButtons={actionButtons}
      tableActionButtons={hideActionButtons ? null : tableActionButtons}
    />
  );
};

export { JobsFiltersSection };
