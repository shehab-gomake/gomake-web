import { Checkbox } from "@mui/material";

import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components"
import {useStyle} from "@/pages-components/credit-card-transactions/widgets/header-widget/style";
import {SearchInput} from "@/components/containers/search-input";
import {
    useCreditCardTransactionsReportHeader
} from "@/pages-components/credit-card-transactions/widgets/header-widget/use-header-credit-card-widget";
import { useState } from "react";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { ExcelSheetIcon } from "@/icons";
import { HeaderTitle } from "@/widgets";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { DEFAULT_VALUES } from "@/pages/customers/enums";

interface CreditCardTransactionsReportHeaderWidgetProps {
    onSelectDeliveryTimeDates:any;
    resetDatePicker:any;
    onClickSearchFilter:any,
    onClickClearFilter:any,
    agent: any;
    agentsCategories: any[];
    handleAgentChange: any;
    customer: any;
    renderOptions: () => any[];
    checkWhatRenderArray: (arg: any) => void;
    handleCustomerChange: any;
}
const CreditCardTransactionsReportHeaderWidget = ({
  agent,
  onSelectDeliveryTimeDates,
  resetDatePicker,
  agentsCategories,
  handleAgentChange,
  customer,
  renderOptions,
  onClickSearchFilter,
  onClickClearFilter,
  checkWhatRenderArray,
  handleCustomerChange,
}: CreditCardTransactionsReportHeaderWidgetProps) => {
  const [patternSearch, setPatternSearch] = useState("");
  const {   t , tableHeaders} = useCreditCardTransactionsReportHeader();
  const allQuotes = [];
  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_VALUES.PageSize);
  const handlePageSizeChange = (event) => {
    setPage(1);
    setPageSize(event.target.value);
  };
  const { classes } = useStyle();
   
  return (
    <>
          <div style={classes.mainContainer}>
          <div style={classes.headerStyle}>
          <HeaderTitle
              marginTop={1}
              marginBottom={1}
              title={t("creditcardTransactions.creditcardTransactions")}
            />
            </div>
          <div style={classes.filtersContainer}>
          <div style={classes.date1FilterContainer}>
                <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                <div style={{ width: "100%" }}>
                  <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
                </div>
              </div>
              <div style={classes.date2FilterContainer}>
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
              <div style={classes.date2FilterContainer}>
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
              <div style={classes.date3FilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.searchBtnStyle}
                            onClick={onClickSearchFilter}
                          >
                            {t("sales.quote.search")}
                          </GomakePrimaryButton>
              </div>
              <div style={classes.date3FilterContainer}>
                          <div style={classes.filterLabelStyle} />
                          <GomakePrimaryButton
                            style={classes.clearBtnStyle}
                            onClick={onClickClearFilter}
                          >
                            {t("sales.quote.clear")}
                          </GomakePrimaryButton>
              </div>    
              <div style={classes.searchFilterContainer}>
              <SearchInputComponent onChange={(e) => setPatternSearch(e)} />
            </div>
          </div>
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
  </>

  );
};
export { CreditCardTransactionsReportHeaderWidget };
