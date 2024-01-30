import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useBoardMissions } from "./use-board-missions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { Stack } from "@mui/material";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";

const BoardMissionsListWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeader,
    renderOptions,
    customer,
    agent,
    status,
    agentsCategories,
    getAgentCategories,
    productionStatuses,
    productIds,
    handleMultiSelectChange,
    getAllProducts,
    productsList,
    onChangeMissionsSearch,
    handleClickSearch,
    handleClickClear,
    allBoardMissions,
    patternSearch,
    handleAgentChange,
    handleStatusChange,
    handleCustomerChange,
    checkWhatRenderArray,
    getAllCustomersCreateQuote,
    handlePageChange,
    pagesCount,
    pageNumber,
    setPageNumber,
    onSelectDeliveryTimeDates,
    resetDatePicker,
    handlePageSizeChange,
    pageSize
  } = useBoardMissions();

  useEffect(() => {
    getAllCustomersCreateQuote();
    getAgentCategories(true);
    getAllProducts();
  }, []);

  return (
    <>
      <Stack direction="column" justifyContent="space-between" display="flex" spacing={1} height="100%" >
        <div style={classes.mainContainer}>
          <HeaderTitle title={t("boardMissions.title")} marginTop={1} marginBottom={1} />
          <div style={classes.filtersContainer}>
            <div style={classes.selectedFilterContainer}>
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("sales.quote.agent")}</h3>
                <GoMakeAutoComplate
                  key={agent?.id}
                  options={agentsCategories}
                  style={classes.textInputStyle}
                  getOptionLabel={(option: any) => option.label}
                  placeholder={t("sales.quote.ChooseAgent")}
                  onChange={handleAgentChange}
                  value={agent}
                />
              </div>
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
                <GoMakeAutoComplate
                  key={customer?.id}
                  options={renderOptions()}
                  onChangeTextField={checkWhatRenderArray}
                  getOptionLabel={(option: any) => `${option.name}`}
                  style={classes.textInputStyle}
                  placeholder={t("sales.quote.chooseCustomer")}
                  onChange={handleCustomerChange}
                  value={customer}
                />
              </div>
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.productionStatus")}</h3>
                <GoMakeAutoComplate
                  key={status?.value}
                  options={productionStatuses}
                  style={classes.textInputStyle}
                  placeholder={t("boardMissions.productionStatus")}
                  onChange={handleStatusChange}
                  value={status}
                />
              </div>
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("Products")}</h3>
                <GoMakeMultiSelect
                  onChange={handleMultiSelectChange}
                  style={classes.textInputStyle}
                  options={productsList}
                  values={productIds}
                  placeholder="Select products" />
              </div>
              <div style={classes.statusFilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder="Choose a date" reset={resetDatePicker} />
              </div>
              <GomakePrimaryButton
                style={classes.searchBtnStyle}
                onClick={handleClickSearch}
              >{t("sales.quote.search")}
              </GomakePrimaryButton>
              <GomakePrimaryButton
                style={classes.clearBtnStyle}
                onClick={handleClickClear}
              >{t("sales.quote.clear")}
              </GomakePrimaryButton>
            </div>
            <SearchInputComponent onChange={onChangeMissionsSearch} value={patternSearch} />
          </div>
          <PrimaryTable
            stickyFirstCol={false}
            stickyHeader={false}
            rows={allBoardMissions}
            headers={tableHeader}
          />
        </div>
        <GoMakePagination
          onChangePageNumber={handlePageChange}
          onChangePageSize={handlePageSizeChange}
          page={pageNumber}
          setPage={setPageNumber}
          pagesCount={pagesCount}
          pageSize={pageSize}
        />
      </Stack>
    </>
  );
};

export { BoardMissionsListWidget };