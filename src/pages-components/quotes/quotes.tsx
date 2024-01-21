import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HeaderTitle } from "@/widgets";
import { QuoteLogsWidget } from "./quote-widgets/logs-widget";
import { DOCUMENT_TYPE } from "./enums";
import { Pagination } from "@mui/material";
import { CardsSection } from "./statistics-section/statistics-sections";

interface IProps {
  documentType: DOCUMENT_TYPE;
  isFromHomePage?: boolean;
}
const QuotesListPageWidget = ({
  documentType,
  isFromHomePage = false,
}: IProps) => {
  const { classes } = useStyle();
  const {
    tableHeaders,
    allQuotes,
    quoteStatuses,
    agentsCategories,
    openModal,
    statusId,
    customerId,
    agentId,
    onClickCloseModal,
    setPatternSearch,
    setStatusId,
    setCustomerId,
    setAgentId,
    renderOptions,
    checkWhatRenderArray,
    updateQuoteStatus,
    onClickSearchFilter,
    onClickClearFilter,
    openLogsModal,
    onClickCloseLogsModal,
    modalLogsTitle,
    logsTableHeaders,
    documentLabel,
    allDocuments,
    tableHomeHeader,
    pagesCount,
    page,
    setPage,
    allStatistics,
    onclickCreateNew,
    setStatisticKey,
    t,
  } = useQuotes(documentType);

  return (
    <>
      {!isFromHomePage && (
        <div style={classes.mainContainer}>
          <div style={classes.headerStyle}>
            <HeaderTitle title={documentLabel} marginTop={1} marginBottom={1} />
            {documentType === DOCUMENT_TYPE.quote && <CardsSection statistics={allStatistics} onClick={onclickCreateNew} setState={setStatisticKey}/>}
          </div>
          <div style={classes.filtersContainer}>
            <div style={classes.selectedFilterContainer}>
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
                    setStatusId(value);
                  }}
                  value={statusId}
                />
              </div>
              <div style={classes.statusFilterContainer}>
                <div style={classes.filterLabelStyle}>
                  {t("sales.quote.customer")}
                </div>
                <GoMakeAutoComplate
                  key={customerId?.id}
                  options={renderOptions()}
                  getOptionLabel={(option: any) => `${option.name}`}
                  onChangeTextField={checkWhatRenderArray}
                  style={classes.textInputStyle}
                  placeholder={t("sales.quote.chooseCustomer")}
                  onChange={(e: any, value: any) => {
                    setCustomerId(value);
                  }}
                  value={customerId}
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
                />
              </div>
              <div style={classes.statusFilterContainer}>
                <div style={classes.filterLabelStyle} />
                <GomakePrimaryButton
                  style={classes.searchBtnStyle}
                  onClick={onClickSearchFilter}
                >
                  {t("sales.quote.search")}
                </GomakePrimaryButton>
              </div>
              <div style={classes.statusFilterContainer}>
                <div style={classes.filterLabelStyle} />
                <GomakePrimaryButton
                  style={classes.clearBtnStyle}
                  onClick={onClickClearFilter}
                >
                  {t("sales.quote.clear")}
                </GomakePrimaryButton>
              </div>
            </div>
            <SearchInputComponent onChange={(e) => setPatternSearch(e)} />
          </div>
          <div style={{ minHeight: "65vh", width: "100%" }}>
            <PrimaryTable
              stickyFirstCol={false}
              stickyHeader={false}
              rows={allQuotes}
              headers={tableHeaders}
            />
          </div>
          <div style={classes.paginationStyle}>
            <Pagination
              count={pagesCount}
              variant="outlined"
              color="primary"
              page={page}
              onChange={(event, value) => setPage(value)}
            />
          </div>
        </div>
      )}
      {isFromHomePage && (
        <PrimaryTable
          rows={allDocuments}
          headers={tableHomeHeader}
          variant="ClassicTable"
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
        modalTitle={t("sales.quote.quoteLogs") + " - " + modalLogsTitle}
      >
        <QuoteLogsWidget logsTableHeaders={logsTableHeaders} />
      </GoMakeModal>
    </>
  );
};

export { QuotesListPageWidget };
