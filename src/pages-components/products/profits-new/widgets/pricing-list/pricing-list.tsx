import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useTranslation } from "react-i18next";
import { LineChart } from "@/pages-components/products/profits/widgets/line-chart";
import { PricingListTable } from "./pricing-list-table";
import { useStyle } from "./style";
import { PricingListProps } from "../../interface";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { DuplicateMaterial, PercentageMaterial } from "@/icons";
import { useCopyAction } from "./use-copy-action";
import { EPricingBy, ETransition } from "../../enums/profites-enum";
import { ChangeEvent, useEffect } from "react";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";
import { GoMakeTextInput } from "@/components/text-input/go-make-text-input";

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
  selectedPricingTableItems,
  getAllActionProfitRowsByActionId,
  quantityOfPackages,
  setQuantityOfPackages,
  updatePackageUnitQuantity,
  addNewStepForActionProfitRow,
  updatePricingByForActionPackage,
  actionProfitByActionId,
  getProfitsPricingTables,
  minimumValue,
  isUpdateMinimumValue,
  onBlurMinimumValue,
  setIsUpdateMinimumValue,
  onInputChangeMinimumValue,
}: PricingListProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
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
    onCloseModal,
    setPercentageProfit,
    percentageProfit,
    openProfitModal,
    onCloseProfitModal,
    onOpenProfitModal,
    AddNewProfitForActionProfitsApi,
    updateOutSourceActionSupplier,
    supplierList,
    selectedSupplier,
    setSelectedSupplier,
  } = useCopyAction({
    getAllActionProfitRowsByActionId,
    selectedPricingTableItems,
    getProfitsPricingTables,
  });
  useEffect(() => {
    if (selectedPricingTableItems?.supplierId) {
      const supplier = supplierList.find(
        (supplier) => supplier.id === selectedPricingTableItems?.supplierId
      );
      setSelectedSupplier(supplier);
    }
  }, [
    selectedPricingTableItems,
    supplierList,
    actionProfitByActionId,
    getProfitsPricingTables,
  ]);
  return (
    <div style={classes.pricListWidgetMainContainer}>
      <div style={classes.headerMainCointaner}>
        <div style={classes.listTitle}>
          {t("products.profits.pricingListWidget.pricingListTitle")} (
          {`${router?.query?.actionName || router?.query?.productName}`})
        </div>
        <div style={classes.filtersCointaner}>
          <IconButton
            onClick={handleMoreOptionIconClick}
            style={{ marginRight: -18 }}
          >
            <SettingsIcon stroke={"#000000"} width={24} height={24} />
          </IconButton>
          <GoMakeTextInput
            value={minimumValue === 0 ? "" : minimumValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onInputChangeMinimumValue(e.target.value)}
            onBlur={() => onBlurMinimumValue()}
            style={classes.autoCompleteStyleContainer}
            placeholder="minimum price"
          />
          {router?.query?.isOutSource && (
            <div style={classes.autoCompleteContainer}>
              <GoMakeAutoComplate
                options={supplierList}
                style={classes.autoCompleteStyleContainer}
                onChange={(e, value) => {
                  updateOutSourceActionSupplier(value?.id);
                  setSelectedSupplier(value);
                }}
                getOptionLabel={(option) => option.name}
                placeholder={t("select supplier")}
                value={selectedSupplier}
                key={selectedSupplier}
              />
            </div>
          )}
          <div style={classes.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={PricingBy}
              style={classes.autoCompleteStyleContainer}
              onChange={(e, value) => {
                if (value?.value !== EPricingBy.PACKAGE) {
                  updatePricingByForAction(value);
                } else {
                  updatePricingByForActionPackage(value);
                }
              }}
              value={selectedPricingBy}
              key={selectedPricingTableItems}
            />
          </div>
          {selectedPricingBy?.value === EPricingBy.PACKAGE && (
            <div style={classes.autoCompleteContainer}>
              <GomakeTextInput
                style={classes.autoCompleteStyleContainer}
                onChange={(e) => {
                  setQuantityOfPackages(e.target.value);
                }}
                onBlur={() =>
                  quantityOfPackages !== 0 && updatePackageUnitQuantity()
                }
                value={quantityOfPackages}
                placeholder={t("boardMissions.quantityOfPackages")}
                type="number"
              />
            </div>
          )}
          <div style={classes.autoCompleteContainer}>
            <GoMakeAutoComplate
              options={Transition}
              style={classes.autoCompleteStyleContainer}
              onChange={(e, value) => updateTransitionForAction(value)}
              value={selectedTransition}
              key={selectedPricingTableItems}
              disabled={selectedPricingBy?.value === EPricingBy.PACKAGE}
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
        addNewStepForActionProfitRow={addNewStepForActionProfitRow}
      />
      <div style={classes.chartContainer}>
        <LineChart
          actionProfitRowChartData={actionProfitRowChartData}
          selectedTransition={selectedTransition}
        />
      </div>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        onClick={handleCloseMenu}
      >
        <MenuItem style={classes.menuContainer} onClick={onOpenModal}>
          <DuplicateMaterial />
          <div style={classes.rowTextStyle}>
            {t("products.profits.admin.copyActionProfit")}
          </div>
        </MenuItem>
        <Divider />
        <MenuItem style={classes.menuContainer} onClick={onOpenProfitModal}>
          <PercentageMaterial />
          <div style={classes.rowTextStyle}>
            {t("products.profits.admin.updateProfitPercentage")}
          </div>
        </MenuItem>
      </Menu>
      <GoMakeModal
        modalTitle={t("products.profits.admin.copyActionProfit")}
        insideStyle={{ height: "fit-content", width: "30%" }}
        openModal={openModal}
        onClose={onCloseModal}
      >
        <div style={classes.modalMainContainer}>
          <GoMakeAutoComplate
            options={allActions}
            style={classes.autoCompleteStyle}
            getOptionLabel={(option) => option.name}
            onChange={(e, value) => setSelectedActionId(value)}
            placeholder={t("products.profits.admin.selectAction")}
          />
          <GomakePrimaryButton
            style={classes.btnContainer}
            onClick={CopyActionProfitsToOtherActionApi}
          >
            {t("products.profits.admin.copy")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
      <GoMakeModal
        modalTitle={t("products.profits.admin.updateProfitPercentage")}
        insideStyle={{ height: "fit-content", width: "30%" }}
        openModal={openProfitModal}
        onClose={onCloseProfitModal}
      >
        <div style={classes.modalMainContainer}>
          <GomakeTextInput
            style={classes.multiLineTextInputStyle}
            onChange={(e) => setPercentageProfit(e.target.value)}
            value={percentageProfit}
            placeholder={t("products.profits.admin.profitByPercentage")}
          />
          <GomakePrimaryButton
            style={classes.btnContainer}
            onClick={AddNewProfitForActionProfitsApi}
          >
            {t("documentingSettings.update")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </div>
  );
};
export { PricingList };
