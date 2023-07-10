import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { useRouter } from "next/router";
import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { useMaterialData } from "./use-material-data";
import { materialData } from "./material-data";
import { useCallback, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { GoMakeAutoComplate, SecondSwitch } from "@/components";

export default function MaterialData() {
  const router: any = useRouter();
  const { t } = useTranslation();
  const [data, setData] = useState();

  useEffect(() => {
    if (router?.query?.material) setData(materialData[router?.query?.material]);
  }, [router]);
  const {
    sheetCategories,
    selectedMaterials,
    materialsStore,
    anchorEl,
    onChangeSelectedSupplier,
    onChangeSupplierToDefault,
    setSelectedMaterials,
    onClickAddNewSupplier,
    handleClick,
  } = useMaterialData({ materialData: data });
  const { clasess } = useStyle();
  const Side = () => (
    <SideList
      isTranslated={true}
      list={sheetCategories}
      selectedItem={selectedMaterials}
      onSelect={setSelectedMaterials}
      title={t("materials.sheetPaper.chooseName")}
    />
  );
  const renderHeader = useCallback(() => {
    return (
      <div style={clasess.renderHeaderContainer}>
        <div style={clasess.title}>{selectedMaterials?.value}</div>
        <div style={clasess.subRenderHeaderContainer} key={selectedMaterials}>
          {materialsStore?.suppliers.length > 0 && (
            <GoMakeAutoComplate
              style={clasess.dropDownStyle}
              options={materialsStore?.suppliers}
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
  }, [selectedMaterials, anchorEl, materialsStore]);

  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={router?.query?.material} side={Side()}>
        {renderHeader()}
        {/* <div style={{ paddingLeft: 0 }}>
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
      </div> */}
        {/* <AddSupplierModal
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
        onOpenUpdatePrice={onOpenUpdatePrice}
        onOpenAddPercentToPrice={onOpenAddPercentToPrice}
        updateToActive={updateToActive}
        updateToInActive={updateToInActive}
        onOpenUpdateCurrency={onOpenUpdateCurrency}
      /> */}
      </MaterialsLayout>
    </CustomerAuthLayout>
  );
}
