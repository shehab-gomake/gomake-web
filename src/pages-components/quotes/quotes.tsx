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
import { EDocumentTypeEnum } from "@/enums";
import { QuoteLogsWidget } from "./quote-widgets/logs-widget";
interface IListWidgetProps {
  documentType: EDocumentTypeEnum
}
const QuotesListPageWidget = (props:IListWidgetProps) => {
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
    t,
  } = useQuotes();

  return (
    <>
      <div style={classes.mainContainer}>
        <HeaderTitle
          title={t("sales.quote.quoteList")}
          marginTop={1}
          marginBottom={1}
        />
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
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={allQuotes}
          headers={tableHeaders}
        />
      </div>
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
        insideStyle={clasess.insideStyle}
        openModal={openLogsModal}
        onClose={onClickCloseLogsModal}
        modalTitle={t('sales.quote.quoteLogs') + ' - ' + modalLogsTitle}>
        <QuoteLogsWidget logsTableHeaders={logsTableHeaders}/>
      </GoMakeModal>
    </>
  );
};

export { QuotesListPageWidget };