import { useTranslation } from "react-i18next";

import { AdminAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheets } from "./use-sheets";
import { HeaderFilter } from "./header-filter";

export default function Sheets() {
  const { t } = useTranslation();
  const {
    headerTable,
    allSheets,
    openAddSheetModal,
    onCloseModalAdded,
    onOpnModalAdded,
  } = useSheets();
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.admin.title")} />
      <HeaderFilter
        openAddSheetModal={openAddSheetModal}
        onCloseModalAdded={onCloseModalAdded}
        onOpnModalAdded={onOpnModalAdded}
      />
      <Table tableHeaders={headerTable} tableRows={allSheets} />
    </AdminAuthLayout>
  );
}
