import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-hardboards";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const {
    categoryName,
    hardboardsCategores,
    hardboardsSizes,
    tabelHeaders,
    setHardboardSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useSheetPaper();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.hardboards.title")} />
      <HeaderFilter
        hardboardsSizes={hardboardsSizes}
        hardboardsCategores={hardboardsCategores}
        categoryName={categoryName}
        setHardboardSizes={setHardboardSizes}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={tabelHeaders} tableRows={hardboardsSizes} />
    </CustomerAuthLayout>
  );
}
