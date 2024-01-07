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


const BoardMissionsListWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeader,
    getAllCustomers,
    renderOptions,
    setCustomer,
    customer,
    setAgent,
    agent,
    setStatus,
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
  } = useBoardMissions();

  useEffect(() => {
    getAllCustomers();
    getAgentCategories(true);
    getAllProducts();
  }, [])


  return (
    <>
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
                onChange={(e: any, value: any) => {
                  setAgent(value);
                }}
                value={agent}
              />
            </div>
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
              <GoMakeAutoComplate
                key={customer?.id}
                options={renderOptions()}
                getOptionLabel={(option: any) => `${option.name}`}
                style={classes.textInputStyle}
                placeholder={t("sales.quote.chooseCustomer")}
                onChange={(e: any, value: any) => {
                  setCustomer(value);
                }}
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
                onChange={(e: any, value: any) => {
                  setStatus(value);
                }}
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
              <GoMakeDatepicker />
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
    </>
  );
};

export { BoardMissionsListWidget };
