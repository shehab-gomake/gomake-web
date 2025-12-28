import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useRepeatOrders } from "./use-repeat-orders";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { JobsFiltersSection } from "../board-missions/components/jobs-filters-section";
import { RepeatOrderCard } from "./components/repeat-order-card";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";

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
      justifyContent="space-between"
      display="flex"
      spacing={1}
      height="100%"
    >
      <div style={classes.mainContainer}>
        <HeaderTitle
          title={t("repeatOrders.title")}
          marginTop={1}
          marginBottom={1}
        />

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

        {/* Jobs Cards Grid */}
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
            width="100%"
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
            width="100%"
          >
            <Box
              style={{
                ...FONT_FAMILY.Lexend(500, 16),
                color: "#FF0000",
              }}
            >
              {t("repeatOrders.errorLoadingJobs")}
            </Box>
          </Box>
        ) : jobs.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="400px"
            width="100%"
          >
            <Box
              style={{
                ...FONT_FAMILY.Lexend(500, 16),
                color: "#666",
              }}
            >
              {t("repeatOrders.noJobsFound")}
            </Box>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ padding: "20px 0" }}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                <RepeatOrderCard
                  job={job}
                  quantity={quantities[job.id] || job.quantity || 1}
                  onQuantityIncrease={() => handleQuantityIncrease(job.id)}
                  onQuantityDecrease={() => handleQuantityDecrease(job.id)}
                  onRepeatOrder={() => handleRepeatOrder(job)}
                  formatISODateTime={formatISODateTime}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
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
