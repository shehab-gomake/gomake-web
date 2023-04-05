import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheetPaper } from "./use-sheet-paper";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { allWeights, headerTable } = useSheetPaper();
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.title")} />
      <HeaderFilter />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={headerTable} tableRows={allWeights} />
      </div>
    </CustomerAuthLayout>
  );
}
