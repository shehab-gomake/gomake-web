import { useTranslation } from "react-i18next";
import { HeaderTitle } from "@/widgets";
import { useRepeatOrders } from "./use-repeat-orders";
import { Box, CircularProgress, Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { JobsFiltersSection } from "../board-missions/components/jobs-filters-section";
import { JobsCardsView } from "../board-missions/components/jobs-cards-view";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";
import { useStyle } from "./style";
// import { useStyle } from "../board-missions/style";

const RepeatOrdersWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    // Filters
    customer,
    renderOptions,
    checkWhatRenderArray,
    isFetching,
    agent,
    agentsCategories,
    handleAgentChange,
    status,
    handleStatusChange,
    productionStatuses,
    orderStatus,
    handleOrderStatusChange,
    orderStatuses,
    proofTypes,
    handleProofTypesChange,
    isPrintedState,
    setIsPrintedState,
    isQualityFixJob,
    setIsQualityFixJob,
    productsList,
    productIds,
    handleMultiSelectChange,
    fromDate,
    toDate,
    onSelectDeliveryTimeDates,
    fromDueDate,
    toDueDate,
    onSelectDueTimeDates,
    fromReadyDate,
    toReadyDate,
    onSelectReadyTimeDates,
    patternSearch,
    onChangeMissionsSearch,
    handleClickSearch,
    handleClickClear,
    handleCustomerChange,

    // Data
    jobs,
    isLoading,
    isError,

    // Pagination
    pageNumber,
    setPageNumber,
    pagesCount,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    initialPageSize,

    // Quantity management
    quantities,
    handleQuantityIncrease,
    handleQuantityDecrease,
    handleRepeatOrder,

    // Utils
    formatISODateTime,
    router,
    exampleTypeValues,

    // Change Status Modal
    openChangeStatusModalForRepeatOrder,
    onClickCloseChangeStatusModalForRepeatOrder,
    updateQuoteStatusForRepeatOrder,
  } = useRepeatOrders();

  return (
    <Stack
      direction="column"
      display="flex"
      height="100%"
      sx={classes.pageContainer}
    >
      <Box sx={classes.headerContainer}>
        <HeaderTitle
          title={t("repeatOrders.title")}
          marginTop={1}
          marginBottom={1}
        />
      </Box>

      <Box sx={classes.filtersContainer}>
        <JobsFiltersSection
          // Customer/Supplier props
          customer={customer}
          handleCustomerChange={handleCustomerChange}
          renderOptions={renderOptions}
          checkWhatRenderArray={checkWhatRenderArray}
          isFetching={isFetching}
          isPurchaseJobs={false}
          // Agent props
          agent={agent}
          agentsCategories={agentsCategories}
          handleAgentChange={handleAgentChange}
          // Production status props
          status={status}
          handleStatusChange={handleStatusChange}
          productionStatuses={productionStatuses}
          // Status props
          orderStatus={orderStatus}
          handleOrderStatusChange={handleOrderStatusChange}
          orderStatuses={orderStatuses}
          // Proof types props
          proofTypes={proofTypes}
          exampleTypeValues={exampleTypeValues}
          handleProofTypesChange={handleProofTypesChange}
          // Is printed props
          isPrintedState={isPrintedState}
          setIsPrintedState={setIsPrintedState}
          isPrintHouseUsePrintNode={false}
          // Is Quality fix job props
          isQualityFixJob={isQualityFixJob}
          setIsQualityFixJob={setIsQualityFixJob}
          // Products props
          productsList={productsList}
          productIds={productIds}
          handleMultiSelectChange={handleMultiSelectChange}
          // Date range props
          fromDate={fromDate}
          toDate={toDate}
          onSelectDeliveryTimeDates={onSelectDeliveryTimeDates}
          fromDueDate={fromDueDate}
          toDueDate={toDueDate}
          onSelectDueTimeDates={onSelectDueTimeDates}
          fromReadyDate={fromReadyDate}
          toReadyDate={toReadyDate}
          onSelectReadyTimeDates={onSelectReadyTimeDates}
          // Search props
          patternSearch={patternSearch}
          onChangeMissionsSearch={onChangeMissionsSearch}
          // Action props
          onClickClearFilter={handleClickClear}
          onClickSearchFilter={handleClickSearch}
          // Menu component props
          columnsReady={true}
          tableKey="repeat-orders"
          ExportJobsTableToExcel={() => {}}
          onGenerateReportClick={() => {}}
          // Styles
          classes={classes}
          hideActionButtons={true}
        />
      </Box>

      <Box sx={classes.scrollableContainer}>
        <JobsCardsView
          jobs={jobs}
          isLoading={isLoading}
          isError={isError}
          quantities={quantities}
          onQuantityIncrease={handleQuantityIncrease}
          onQuantityDecrease={handleQuantityDecrease}
          onRepeatOrder={handleRepeatOrder}
          formatISODateTime={formatISODateTime}
          showQuantityControls={true}
          showRepeatButton={true}
        />
      </Box>

      <Box sx={classes.paginationContainer}>
        <GoMakePagination
          onChangePageNumber={handlePageChange}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
          router={router}
          isFromDocumentsOrJobs={true}
          initialPageSize={initialPageSize}
        />
      </Box>

      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("sales.quote.titleModal")}
        subTitle={t("sales.quote.subTitleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openChangeStatusModalForRepeatOrder}
        onClose={onClickCloseChangeStatusModalForRepeatOrder}
        onClickDelete={updateQuoteStatusForRepeatOrder}
      />
    </Stack>
  );
};

export { RepeatOrdersWidget };
