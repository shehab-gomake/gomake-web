import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton } from "@/components";
import { useTranslation } from "react-i18next";
import { LineChart } from "@/pages-components/products/profits/widgets/line-chart";
import { PricingListTable } from "./pricing-list-table";
import { useStyle } from "./style";
import { PricingListProps } from "../../interface";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { DuplicateMaterial } from "@/icons";

import { useCopyAction } from "./use-copy-action";


const PricingList = ({
  tableHeaders,
  tableBodyList,
  PricingBy,
  Transition,
  actionProfitRowChartData,
  selectedTransition,
  selectedPricingBy,
  updatePricingByForAction,
  updateTransitionForAction,
  changeactionProfitRowsItems,
  onOpenAddStepModal,
  updateActionProfitRow,
  anchorElMorePriceTable,
  openMorePriceTable,
  handleClickMorePriceTable,
  handleCloseMorePriceTable,
  selectedActionProfitRow,
  setSelectedActionProfit,
  deleteActionProfitRow,
  selectedAdditionalProfitRow,
  selectedPricingTableItems
}: PricingListProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    router,
    anchorEl,
    openModal,
    allActions,
    setSelectedActionId,
    handleMoreOptionIconClick,
    onOpenModal,
    CopyActionProfitsToOtherActionApi,
    handleCloseMenu,
    onCloseModal
  } = useCopyAction()

  return (
    <div style={clasess.pricListWidgetMainContainer}>
      <div style={clasess.headerMainCointaner}>
        <div style={clasess.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")} ({`${router?.query?.actionName}`})
        </div>
        <div style={clasess.filtersCointaner}>
          <IconButton onClick={handleMoreOptionIconClick} style={{ marginRight: -18 }} >
            <SettingsIcon stroke={"#000000"} width={24} height={24} />
          </IconButton>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={PricingBy}
              style={clasess.autoCompleteStyleContainer}
              onChange={(e, value) => updatePricingByForAction(value)}
              value={selectedPricingBy}
              key={selectedPricingTableItems}
            />
          </div>
          <div style={clasess.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={Transition}
              style={clasess.autoCompleteStyleContainer}
              onChange={(e, value) => updateTransitionForAction(value)}
              value={selectedTransition}
              key={selectedPricingTableItems}
            />
          </div>

        </div>
      </div>
      <PricingListTable
        tableHeaders={tableHeaders}
        tableBodyList={tableBodyList}
        changeactionProfitRowsItems={changeactionProfitRowsItems}
        onOpenAddStepModal={onOpenAddStepModal}
        updateActionProfitRow={updateActionProfitRow}
        selectedPricingBy={selectedPricingBy}
        handleClickMorePriceTable={handleClickMorePriceTable}
        handleCloseMorePriceTable={handleCloseMorePriceTable}
        anchorElMorePriceTable={anchorElMorePriceTable}
        openMorePriceTable={openMorePriceTable}
        selectedActionProfitRow={selectedActionProfitRow}
        setSelectedActionProfit={setSelectedActionProfit}
        deleteActionProfitRow={deleteActionProfitRow}
        selectedAdditionalProfitRow={selectedAdditionalProfitRow}
      />
      <div style={clasess.chartContainer}>
        <LineChart actionProfitRowChartData={actionProfitRowChartData} />
      </div>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        <MenuItem style={clasess.menuContainer} onClick={onOpenModal}>
          <DuplicateMaterial />
          <div style={clasess.rowTextStyle}>
            {t("products.profits.admin.copyActionProfit")}
          </div>
        </MenuItem>
        {/* <Divider /> */}

      </Menu>
      <GoMakeModal modalTitle={t("products.profits.admin.copyActionProfit")} insideStyle={{ height: 'fit-content', width: "30%" }} openModal={openModal} onClose={onCloseModal}>
        <div style={clasess.modalMainContainer}>
          <GoMakeAutoComplate
            options={allActions}
            style={clasess.autoCompleteStyle}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setSelectedActionId(value)}
            placeholder={t("products.profits.admin.selectAction")}
          />
          <GomakePrimaryButton
            style={clasess.btnContainer}
            onClick={CopyActionProfitsToOtherActionApi}
          >
            {t("products.profits.admin.copy")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </div>
  );
};
export { PricingList };
