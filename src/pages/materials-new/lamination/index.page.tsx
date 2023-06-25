import { useTranslation } from "react-i18next";
import React, { useCallback } from "react";

import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { SecondSwitch } from "@/components/switch/second";
import { GoMakeAutoComplate } from "@/components";
import { SettingsIcon } from "@/icons/settings";
import { CustomerAuthLayout } from "@/layouts";
import { IconButton } from "@mui/material";

import { UpdatePricePerTonModal } from "./modals/update-price-per-ton-modal";
import { UpdateCurrencyModal } from "./modals/update-currency-modal";
import { AddSupplierModal } from "./modals/add-supplier-modal";
import { HeaderTableWidget } from "./widgets/header-table";
import { SheetSizesWidget } from "./widgets/sheet-sizes";
import { SettingsMenuModal } from "./modals/menu";
import { useLamination } from "./use-lamination";
import { useStyle } from "./style";

export default function Lamination() {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  const {
    sheetCategories,
    allWeightsGrouped,
    selectedMaterials,
    sheetStore,
    suppliers,
    showSupplierModal,
    selectedItems,
    isUpdatePricePerTon,
    isUpdateCurrency,
    open,
    anchorEl,
    sheetCheckStore,
    modalTitle,
    selectedSupplier,
    getSheetAllWeights,
    setSheetCheckStore,
    setSelectedMaterials,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    setData,
    handleClick,
    onOpenUpdateCurrency,
    onOpenUpdatePricePerRoll,
    onOpenUpdatePrice,
    onOpenAddPercentToPrice,
    handleCheckboxChange,
    updatePricePetTon,
    handleClose,
    updateToInActive,
    updateToActive,
    onChangeSelectedSupplier,
  } = useLamination();
  const Side = () => (
    <SideList
      list={sheetCategories}
      selectedItem={selectedMaterials}
      onSelect={setSelectedMaterials}
      title={t("materials.sheetPaper.chooseCategory")}
      isTranslated={true}
    />
  );

  const renderHeader = useCallback(() => {
    return (
      <div style={clasess.renderHeaderContainer}>
        <div style={clasess.title}>{selectedMaterials?.value}</div>
        <div style={clasess.subRenderHeaderContainer} key={selectedMaterials}>
          {sheetStore?.suppliers.length > 0 && (
            <GoMakeAutoComplate
              style={clasess.dropDownStyle}
              options={sheetStore?.suppliers}
              placeholder={t("materials.sheetPaper.selectSupplier")}
              onChange={(e: any, value: any) => onChangeSelectedSupplier(value)}
              renderOption={(props: any, option: any) => {
                if (option.label === t("materials.sheetPaper.addNew")) {
                  return (
                    <div
                      onClick={onClickAddNewSupplier}
                      style={clasess.addSupplierAutoComplate}
                    >
                      {t("materials.sheetPaper.addNewSupplier")}
                    </div>
                  );
                }
                return (
                  <div style={clasess.optionsContainer}>
                    <div {...props} style={{ width: "100%" }}>
                      {option.label}
                    </div>
                    <div>
                      <SecondSwitch
                        checked={option?.isDefault}
                        onChange={(a: any, value: any) => {
                          onChangeSupplierToDefault(option, value);
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
          )}
          <IconButton onClick={handleClick}>
            <SettingsIcon stroke={"#000000"} />
          </IconButton>
        </div>
      </div>
    );
  }, [selectedMaterials, open, anchorEl, sheetStore]);

  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={t("materials.lamination.title")} side={Side()}>
        {renderHeader()}
        <div style={{ paddingLeft: 0 }}>
          {allWeightsGrouped.length === 0 ? (
            <div style={clasess.noData}>
              {t("materials.sheetPaper.supplierAddedSheetYet")}
              <span style={clasess.noDataSpan} onClick={onClickAddNewSupplier}>
                {t("materials.sheetPaper.pleaseAddNow")}
              </span>
            </div>
          ) : (
            <>
              {["header", ...allWeightsGrouped]?.map(
                (row: any, index: number) => {
                  if (row === "header") {
                    return (
                      <HeaderTableWidget
                        setSheetCheckStore={setSheetCheckStore}
                        sheetCheckStore={sheetCheckStore}
                        index={index}
                      />
                    );
                  }
                  return (
                    <div style={{ ...clasess.bodyRow }}>
                      <div style={clasess.sheetSizeContainer}>
                        <SheetSizesWidget
                          row={row}
                          selectedMaterials={selectedMaterials}
                          selectedSupplier={selectedSupplier}
                          getSheetAllWeights={getSheetAllWeights}
                          index2={index}
                          selectedItems={selectedItems}
                          handleCheckboxChange={handleCheckboxChange}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </>
          )}
        </div>
        <AddSupplierModal
          showSupplierModal={showSupplierModal}
          setShowSupplierModal={setShowSupplierModal}
          suppliers={suppliers}
          onClickAddSupplier={onClickAddSupplier}
        />
        <UpdatePricePerTonModal
          openModal={isUpdatePricePerTon}
          onClose={onCloseUpdatePricePerTon}
          modalTitle={modalTitle}
          onClickBtn={updatePricePetTon}
          onChangeData={setData}
        />
        <UpdateCurrencyModal
          openModal={isUpdateCurrency}
          onClose={onCloseUpdateCurrency}
          onClickBtn={updatePricePetTon}
          onChangeData={setData}
        />
        <SettingsMenuModal
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          onOpenUpdatePricePerRoll={onOpenUpdatePricePerRoll}
          onOpenUpdatePrice={onOpenUpdatePrice}
          onOpenAddPercentToPrice={onOpenAddPercentToPrice}
          updateToActive={updateToActive}
          updateToInActive={updateToInActive}
          onOpenUpdateCurrency={onOpenUpdateCurrency}
        />
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
