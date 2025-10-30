import { JobsFiltersSection } from "@/pages-components/board-missions/components/jobs-filters-section";
import { useDoneJobsFilters } from "../hooks/use-done-jobs-filters";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useStyle } from "@/pages-components/board-missions/style";
import { JobsTableColumns } from "@/pages-components/quotes/enums/document-table-columns-enum";

interface IDoneJobsFiltersSectionProps {
  getAllData: (
    pageNumber: number,
    pageSize: number,
    patternSearch?: string,
    sortOrder?: any
  ) => void;
  onChangeMissionsSearch: (value: string) => void;
}

const DoneJobsFiltersSection = ({
  getAllData,
  onChangeMissionsSearch,
}: IDoneJobsFiltersSectionProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    patternSearch,
    pageSize,
    currentSortOrder,
    customer,
    agent,
    status,
    orderStatus,
    proofTypes,
    orderStatuses,
    exampleTypeValues,
    isPrintedState,
    setIsPrintedState,
    productIds,
    fromDate,
    toDate,
    fromDueDate,
    toDueDate,
    fromReadyDate,
    toReadyDate,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    agentsCategories,
    productsList,
    handleCustomerChange,
    handleAgentChange,
    handleStatusChange,
    handleOrderStatusChange,
    handleProofTypesChange,
    handleMultiSelectChange,
    onSelectDeliveryTimeDates,
    onSelectDueTimeDates,
    onSelectReadyTimeDates,
    onClickClearFilter,
    isPrintHouseUsePrintNode,
  } = useDoneJobsFilters();

  // Production statuses - hardcoded to "Done" since this is the done jobs view
  const productionStatuses = useMemo(
    () => [{ value: "6", label: t("boardMissions.done") }],
    [t]
  );

  // Default sort order: Ready Date descending
  const defaultSortOrder = useMemo(
    () => [
      {
        column: JobsTableColumns.ReadyDate,
        dir: "desc",
      },
    ],
    []
  );

  const onClickSearchFilter = () => {
    // Use current sort order (user's choice) or default if none exists
    getAllData(
      1,
      pageSize,
      patternSearch,
      currentSortOrder || defaultSortOrder
    );
  };

  const handleClearFilter = () => {
    onClickClearFilter();
    onChangeMissionsSearch("");
    // Use current sort order (user's choice) or default if none exists
    getAllData(1, pageSize, "", currentSortOrder || defaultSortOrder);
  };

  return (
    <JobsFiltersSection
      customer={customer}
      renderOptions={renderOptions}
      checkWhatRenderArray={checkWhatRenderArray}
      handleCustomerChange={handleCustomerChange}
      isFetching={isFetching}
      isPurchaseJobs={false}
      agent={agent}
      agentsCategories={agentsCategories}
      handleAgentChange={handleAgentChange}
      status={status}
      handleStatusChange={handleStatusChange}
      productionStatuses={productionStatuses}
      orderStatus={orderStatus}
      handleOrderStatusChange={handleOrderStatusChange}
      orderStatuses={orderStatuses}
      proofTypes={proofTypes}
      exampleTypeValues={exampleTypeValues}
      handleProofTypesChange={handleProofTypesChange}
      isPrintedState={isPrintedState}
      setIsPrintedState={setIsPrintedState}
      isPrintHouseUsePrintNode={isPrintHouseUsePrintNode}
      productsList={productsList}
      productIds={productIds}
      handleMultiSelectChange={handleMultiSelectChange}
      fromDate={fromDate}
      toDate={toDate}
      onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
      fromDueDate={fromDueDate}
      toDueDate={toDueDate}
      onSelectDueTimeDates={onSelectDueTimeDates}
      fromReadyDate={fromReadyDate}
      toReadyDate={toReadyDate}
      onSelectReadyTimeDates={onSelectReadyTimeDates}
      patternSearch={patternSearch}
      onChangeMissionsSearch={onChangeMissionsSearch}
      onClickClearFilter={handleClearFilter}
      onClickSearchFilter={onClickSearchFilter}
      columnsReady={false}
      tableKey="done-jobs-table"
      ExportJobsTableToExcel={() => {}}
      onGenerateReportClick={() => {}}
      classes={classes}
      hideActionButtons={true}
    />
  );
};

export { DoneJobsFiltersSection };
