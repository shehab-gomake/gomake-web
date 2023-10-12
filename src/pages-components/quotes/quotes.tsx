import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useQuotes } from "./use-quote";
import { GoMakeAutoComplate, GoMakeDeleteModal } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HeaderTitle } from "@/widgets";
const QuotesListPageWidget = () => {
  const { clasess } = useStyle();
  const {
    tableHeaders,
    allQuotes,
    quoteStatuses,
    agentsCategories,
    openModal,
    errorColor,
    onClcikCloseModal,
    setPatternSearch,
    setStatusId,
    setCustomerId,
    setAgentId,
    renderOptions,
    checkWhatRenderArray,
    updateQuoteStatus,
    t,
  } = useQuotes();
  return (
    <>
      <div style={clasess.mainContainer}>
        <HeaderTitle
          title={t("sales.quote.quoteList")}
          marginTop={1}
          marginBottom={1}
        />
        <div style={clasess.filtersContainer}>
          <div style={clasess.selectedFilterContainer}>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle}>
                {t("sales.quote.status")}
              </div>
              <GoMakeAutoComplate
                options={quoteStatuses}
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.chooseStatus")}
                onChange={(e: any, value: any) => {
                  setStatusId(value?.value);
                }}
              />
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle}>
                {t("sales.quote.customer")}
              </div>
              <GoMakeAutoComplate
                options={renderOptions()}
                getOptionLabel={(option: any) => `${option.name}`}
                onChangeTextField={checkWhatRenderArray}
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.chooseCustomer")}
                onChange={(e: any, value: any) => {
                  setCustomerId(value?.id);
                }}
              />
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle}>
                {t("sales.quote.agent")}
              </div>
              <GoMakeAutoComplate
                options={agentsCategories}
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.ChooseAgent")}
                onChange={(e: any, value: any) => {
                  setAgentId(value?.id);
                }}
              />
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
        icon={
          <WarningAmberIcon
            style={{ width: 120, height: 120, color: errorColor(300) }}
          />
        }
        title={t("sales.quote.titleModal")}
        yesBtn={t("sales.quote.changeStatus")}
        openModal={openModal}
        onClose={onClcikCloseModal}
        subTitle={t("sales.quote.subTitleModal")}
        onClickDelete={() => updateQuoteStatus()}
      />
    </>
  );
};

export { QuotesListPageWidget };
