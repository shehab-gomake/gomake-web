import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useEncapsulationRoll } from "./use-encapsulation-roll";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const {
    setAllThickness,
    onChangeCategory,
    onChangeSupplier,
    allThickness,
    headerTable,
    encapsulationRollCategories,
    categoryName,
  } = useEncapsulationRoll();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.encapsulationRoll.title")} />
      <HeaderFilter
        allThickness={allThickness}
        encapsulationRollCategories={encapsulationRollCategories}
        categoryName={categoryName}
        setAllThickness={setAllThickness}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={headerTable} tableRows={allThickness} />
    </CustomerAuthLayout>
  );
}
