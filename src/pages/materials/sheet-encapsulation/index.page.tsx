import { useEffect } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useSheetEncapsulation } from "./use-sheet-encapsulation";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function SheetEncapsulation() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    sheetEncapsulationSizes,
    categoryName,
    tabelHeaders,
    sheetEncapsulationCategories,
    setSheetEncapsulationSizes,
    getPackInDrumsSizes,
    onChangeSupplier,
    onChangeCategory,
  } = useSheetEncapsulation();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getPackInDrumsSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.sheetEncapsulation.title")} />
      <HeaderFilter
        setSheetEncapsulationSizes={setSheetEncapsulationSizes}
        onChangeSupplier={onChangeSupplier}
        onChangeCategory={onChangeCategory}
        sheetEncapsulationCategories={sheetEncapsulationCategories}
        categoryName={categoryName}
        sheetEncapsulationSizes={sheetEncapsulationSizes}
      />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={tabelHeaders}
          tableRows={sheetEncapsulationSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
