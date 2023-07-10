import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { useRouter } from "next/router";
import { MaterialsLayout } from "@/widgets/machines/components/layout/materials-layout";
import { SideList } from "@/widgets/materials/side-list/side-list";
import { useMaterialData } from "./use-material-data";
import { materialData } from "./material-data";

export default function MaterialData() {
  const router: any = useRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { setSelectedMaterials, selectedMaterials } = useMaterialData();
  const data = materialData[router?.query?.material];
  const Side = () => (
    <SideList
      isCode={true}
      // list={sheetCategories}
      selectedItem={selectedMaterials}
      onSelect={setSelectedMaterials}
      title={t("materials.sheetPaper.chooseName")}
    />
  );
  return (
    <CustomerAuthLayout>
      <MaterialsLayout header={t("materials.additions.title")} side={Side()}>
        {/* {renderHeader()} */}
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
