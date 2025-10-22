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
import { DateRangePicker } from "rsuite";
import ProductMultiSelect from "@/components/auto-complete/product-multi-select";
import { BoardMissionsColumnSettingsMenu } from "../widgets/board-missions-column-settings-menu/board-missions-column-settings-menu";
import { ExcelMenu } from "@/pages-components/quotes/widgets/excel-menu/excel-menu";

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

  predefinedRanges: any[];

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
  predefinedRanges,
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
      id: "products",
      label: t("boardMissions.products"),
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
        <div>
          <DateRangePicker
            onChange={onSelectDeliveryTimeDates}
            value={fromDate && toDate ? [fromDate, toDate] : null}
            ranges={predefinedRanges}
            placement={isRTL ? "bottomEnd" : "bottomStart"}
            style={{ direction: dir }}
          />
        </div>
      ),
    },
    {
      id: "dueDate",
      label: t("boardMissions.dueDate"),
      component: (
        <div>
          <DateRangePicker
            onChange={onSelectDueTimeDates}
            value={fromDueDate && toDueDate ? [fromDueDate, toDueDate] : null}
            ranges={predefinedRanges}
            placement={isRTL ? "bottomEnd" : "bottomStart"}
            style={{ direction: dir }}
          />
        </div>
      ),
    },
    {
      id: "readyDate",
      label: t("boardMissions.readyDate"),
      component: (
        <div>
          <DateRangePicker
            onChange={onSelectReadyTimeDates}
            value={
              fromReadyDate && toReadyDate ? [fromReadyDate, toReadyDate] : null
            }
            ranges={predefinedRanges}
            placement={isRTL ? "bottomEnd" : "bottomStart"}
            style={{ direction: dir }}
          />
        </div>
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
      {!isPurchaseJobs && (
        <ExcelMenu
          onGenerateReportClick={onGenerateReportClick}
          onExportTableClick={ExportJobsTableToExcel}
          documentType={null}
        />
      )}
    </>
  );

  return (
    <FilterSectionComponent
      filters={filters}
      actionButtons={actionButtons}
      tableActionButtons={tableActionButtons}
    />
  );
};

export { JobsFiltersSection };
