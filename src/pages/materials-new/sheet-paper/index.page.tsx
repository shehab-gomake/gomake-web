import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { IconButton } from "@mui/material";
import { SecondSwitch } from "@/components/switch/second";
import { SettingsIcon } from "@/icons/settings";
import { CustomerAuthLayout } from "@/layouts";
import { GoMakeAutoComplate } from "@/components";

import { UpdatePricePerTonModal } from "./modals/update-price-per-ton-modal";
import { UpdateCurrencyModal } from "./modals/update-currency-modal";
import { SettingsMenuModal } from "./modals/menu";
import { useSheetPaper } from "./use-sheet-paper";
import { SheetCheckBox } from "./widgets/checkbox";
import { HeaderTableWidget } from "./widgets/header-table";
import { SheetSizesWidget } from "./widgets/sheet-sizes";
import { AddSupplierModal } from "./modals/add-supplier-modal";
import { useStyle } from "./style";

export default function SheetPaper() {
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
    setSheetCheckStore,
    setSelectedMaterials,
    setSelectedSupplier,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    setData,
    handleClick,
    onOpenUpdateCurrency,
    onOpenUpdatePricePerTon,
    onOpenUpdateUnitPrice,
    onOpenAddPercentToPrice,
    handleCheckboxChange,
    updatePricePetTon,
    handleClose,
    updateToInActive,
    updateToActive,
  } = useSheetPaper();
  const Side = () => (
    <SideList
      list={sheetCategories}
      selectedItem={selectedMaterials}
      onSelect={setSelectedMaterials}
      title={"Choose Category"}
    />
  );

  const renderHeader = useCallback(() => {
    return (
      <div style={clasess.renderHeaderContainer}>
        <div style={clasess.title}>{selectedMaterials}</div>
        <div style={clasess.subRenderHeaderContainer} key={selectedMaterials}>
          {sheetStore?.suppliers.length > 0 && (
            <GoMakeAutoComplate
              style={clasess.dropDownStyle}
              options={sheetStore?.suppliers}
              placeholder={"Select Supplier"}
              renderOption={(props: any, option: any) => {
                if (option.label === "Add new") {
                  return (
                    <div
                      onClick={onClickAddNewSupplier}
                      style={clasess.addSupplierAutoComplate}
                    >
                      Add new Supplier
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
      <MaterialsLayout header={t("materials.sheetPaper.title")} side={Side()}>
        {renderHeader()}
        <div style={{ paddingLeft: 0 }}>
          {allWeightsGrouped.length === 0 ? (
            <div style={clasess.noData}>
              There is supplier added to this sheet yet,
              <span style={clasess.noDataSpan} onClick={onClickAddNewSupplier}>
                Please add new one now.
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
                    <div
                      style={{ ...clasess.bodyRow, borderBottom: "1px solid" }}
                    >
                      <div style={clasess.sizeWaightsContainer}>
                        {row?.sheetSizes?.length &&
                          row?.sheetSizes?.map((size: any, index2: number) => {
                            return (
                              <div
                                style={clasess.checkboxSizeContainer}
                                key={index2}
                              >
                                <SheetCheckBox
                                  selectedItems={selectedItems}
                                  handleCheckboxChange={handleCheckboxChange}
                                  size={size}
                                  row={row}
                                />
                              </div>
                            );
                          })}
                      </div>

                      <div style={clasess.weightSizeContainer}>
                        {row.weight}
                      </div>
                      <div style={clasess.sheetSizeContainer}>
                        {row?.sheetSizes?.length &&
                          row?.sheetSizes?.map((size: any, index2: number) => {
                            return (
                              <SheetSizesWidget
                                key={index2}
                                index2={index2}
                                size={size}
                                row={row}
                              />
                            );
                          })}
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
          setSelectedSupplier={setSelectedSupplier}
          onClickAddSupplier={onClickAddSupplier}
        />
        <UpdatePricePerTonModal
          openModal={isUpdatePricePerTon}
          onClose={onCloseUpdatePricePerTon}
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
          onOpenUpdatePricePerTon={onOpenUpdatePricePerTon}
          onOpenUpdateUnitPrice={onOpenUpdateUnitPrice}
          onOpenAddPercentToPrice={onOpenAddPercentToPrice}
          updateToActive={updateToActive}
          updateToInActive={updateToInActive}
          onOpenUpdateCurrency={onOpenUpdateCurrency}
        />
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
