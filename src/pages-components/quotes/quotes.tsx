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
import { Button, IconButton, Stack } from "@mui/material";
import { CardsSection } from "./statistics-section/statistics-sections";
import { GoMakePagination } from "@/components/pagination/gomake-pagination";
import { ExcelSheetIcon, SettingNewIcon } from "@/icons";
import { AddRuleModal } from "../products/profits-new/widgets/add-rule-modal";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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
    onClickCloseLogsModal,
    setPage,
    onclickCreateNew,
    t,
    handlePageSizeChange,
    handleCardClick,
    handleSecondCardClick,
    onCloseAddRuleModal,
    onOpenAddRuleModal,
    navigate,
    onSelectDeliveryTimeDates,
    tableHeaders,
    allQuotes,
    quoteStatuses,
    deliveryNoteStatuses,
    agentsCategories,
    openModal,
    statusId,
    customerId,
    agentId,
    openLogsModal,
    modalLogsTitle,
    logsTableHeaders,
    documentLabel,
    allDocuments,
    tableHomeHeader,
    pagesCount,
    page,
    allStatistics,
    pageSize,
    activeCard,
    openAddRule,
    documentPath,
    resetDatePicker,
  } = useQuotes(documentType);

  return (
    <>
      {!isFromHomePage && (
        <Stack
          direction="column"
          justifyContent="space-between"
          display="flex"
          spacing={2}
          height="100%"
        >
          <div style={classes.mainContainer}>
            <div style={classes.headerStyle}>
              <HeaderTitle title={documentLabel} marginTop={1} marginBottom={1} />
              {documentType === DOCUMENT_TYPE.quote && <CardsSection statistics={allStatistics} activeCard={activeCard} onClick={onclickCreateNew} onClickCard={handleCardClick} onSecondClickCard={handleSecondCardClick} />}
              {(documentType !== DOCUMENT_TYPE.quote && documentType !== DOCUMENT_TYPE.order) &&
                <Button
                  style={classes.createNew}
                  onClick={() => navigate(`/${documentPath}?isNewCreation=true`)}
                  startIcon={<AddCircleOutlineIcon style={{ color: 'black', fontSize: "24px" }} />}>
                  {t("sales.quote.createNew")}
                </Button>
              }
            </div>
            <div style={classes.filtersContainer}>
              <div style={classes.selectedFilterContainer}>
                <div style={classes.statusFilterContainer}>
                  <div style={classes.filterLabelStyle}>
                    {t("sales.quote.status")}
                  </div>
                  <GoMakeAutoComplate
                    key={statusId?.value}
                    options={documentType === DOCUMENT_TYPE.receipt ? deliveryNoteStatuses : quoteStatuses}
                    style={classes.textInputStyle}
                    getOptionLabel={(option: any) => option.label}
                    placeholder={t("sales.quote.chooseStatus")}
                    onChange={(e: any, value: any) => {
                      setPage(1);
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
                {documentType === DOCUMENT_TYPE.receipt && <div style={classes.statusFilterContainer}>
                  <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                  <GoMakeDatepicker onChange={onSelectDeliveryTimeDates} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
                </div>}
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
              <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <SearchInputComponent onChange={(e) => setPatternSearch(e)} />
                <div style={{ cursor: "pointer" }} onClick={onOpenAddRuleModal}>
                  <ExcelSheetIcon />
                </div>
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
        </Stack>
      )}
      {isFromHomePage && (
        <PrimaryTable
          stickyHeader={true}
          maxHeight={400}
          rows={allDocuments}
          headers={tableHomeHeader}
          variant="ClassicTable"
          withoutShadow={true}
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
      <AddRuleModal
        openModal={openAddRule}
        onCloseModal={onCloseAddRuleModal}
        isQuoteWidge={true}
      />
    </>
  );
};

export { QuotesListPageWidget };
