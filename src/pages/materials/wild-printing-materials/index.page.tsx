import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useWildPrintingMaterials } from "./use-wild-printing-materials";
import { HeaderFilter } from "./header-filter";

export default function WildPrintingMaterials() {
  const { t } = useTranslation();
  const {
    onChangeCategory,
    onChangeSupplier,
    setAllTypes,
    WildPrintingMaterialCategories,
    allTypes,
    categoryName,
    headerTable,
  } = useWildPrintingMaterials();
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.wildPrintingMaterials.title")} />
      <HeaderFilter
        allTypes={allTypes}
        WildPrintingMaterialCategories={WildPrintingMaterialCategories}
        categoryName={categoryName}
        setAllTypes={setAllTypes}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={headerTable} tableRows={allTypes} />
    </CustomerAuthLayout>
  );
}
