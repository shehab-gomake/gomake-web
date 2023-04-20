import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useEffect, useState } from "react";
import { Table } from "@/widgets/table/table";
import { useSetRecoilState } from "recoil";
import { usePrintingMaterials } from "./use-printing-materials-for-rolls";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    printingMaterialsCategores,
    categoryName,
    printingMaterialsSizes,
    getPrintingMaterialsSizes,
    setPrintingMaterialsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = usePrintingMaterials();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getPrintingMaterialsSizes(),
    });
  }, [supplierId, categoryName]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.printingMaterials.title")} />
      <HeaderFilter
        setPrintingMaterialsSizes={setPrintingMaterialsSizes}
        printingMaterialsSizes={printingMaterialsSizes}
        categoryName={categoryName}
        printingMaterialsCategores={printingMaterialsCategores}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.printingMaterials.code"),
            t("materials.printingMaterials.height"),
            t("materials.printingMaterials.width"),
            t("materials.printingMaterials.stock"),
            t("materials.printingMaterials.pricePerSquareMeter"),
            t("materials.printingMaterials.weightPerSquareMeter"),
            t("materials.printingMaterials.withPremier"),
            t("materials.printingMaterials.settings"),
          ]}
          tableRows={printingMaterialsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
