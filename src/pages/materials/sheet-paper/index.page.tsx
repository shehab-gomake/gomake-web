import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-sheet-paper";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { headerTable } = useSheetPaper();
  const [allWeights, setAllWeights] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.title")} />
      <HeaderFilter setAllWeights={setAllWeights} />
      <Table tableHeaders={headerTable} tableRows={allWeights} />
    </CustomerAuthLayout>
  );
}
