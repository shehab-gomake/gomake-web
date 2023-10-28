import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useOrders } from "./use-orders";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GomakePrimaryButton,
} from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { HeaderTitle } from "@/widgets";
const OrdersListPageWidget = () => {
  const { clasess } = useStyle();
  const {
    tableHeaders,
    allOrders,
    quoteStatuses,
    agentsCategories,
    openModal,
    statusId,
    customerId,
    agentId,
    errorColor,
    onClcikCloseModal,
    setPatternSearch,
    setStatusId,
    setCustomerId,
    setAgentId,
    renderOptions,
    checkWhatRenderArray,
    updateQuoteStatus,
    onClickSearchFilter,
    onClcikClearFilter,
    t,
  } = useOrders();
  return (
    <>
      <div style={clasess.mainContainer}>
        <HeaderTitle
          title={t("sales.quote.orderList")}
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
                key={statusId?.value}
                options={quoteStatuses}
                style={clasess.textInputStyle}
                getOptionLabel={(option: any) => option.label}
                placeholder={t("sales.quote.chooseStatus")}
                onChange={(e: any, value: any) => {
                  setStatusId(value);
                }}
                value={statusId}
              />
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle}>
                {t("sales.quote.customer")}
              </div>
              <GoMakeAutoComplate
                key={customerId?.id}
                options={renderOptions()}
                getOptionLabel={(option: any) => `${option.name}`}
                onChangeTextField={checkWhatRenderArray}
                style={clasess.textInputStyle}
                placeholder={t("sales.quote.chooseCustomer")}
                onChange={(e: any, value: any) => {
                  setCustomerId(value);
                }}
                value={customerId}
              />
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle}>
                {t("sales.quote.agent")}
              </div>
              <GoMakeAutoComplate
                key={agentId?.id}
                options={agentsCategories}
                style={clasess.textInputStyle}
                getOptionLabel={(option: any) => option.label}
                placeholder={t("sales.quote.ChooseAgent")}
                onChange={(e: any, value: any) => {
                  setAgentId(value);
                }}
                value={agentId}
              />
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle} />
              <GomakePrimaryButton
                style={clasess.searchBtnStyle}
                onClick={onClickSearchFilter}
              >
                {t("sales.quote.search")}
              </GomakePrimaryButton>
            </div>
            <div style={clasess.statusFilterContainer}>
              <div style={clasess.filterLabelStyle} />
              <GomakePrimaryButton
                style={clasess.clearBtnStyle}
                onClick={onClcikClearFilter}
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
          rows={allOrders}
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

export { OrdersListPageWidget };
