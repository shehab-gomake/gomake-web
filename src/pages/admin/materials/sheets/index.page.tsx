import { useTranslation } from "react-i18next";

import { AdminAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheets } from "./use-sheets";
import { HeaderFilter } from "./header-filter";
import { useSetRecoilState } from "recoil";
import { materialSheetsState } from "./store/sheets";
import { useEffect } from "react";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialSheetsState = useSetRecoilState<any>(materialSheetsState);
  const {
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
  } = useSheets();

  useEffect(() => {
    setMaterialSheetsState({
      headerTable,
      allSheets,
      openAddSheetModal,
      items,
      categoryName,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierSheet,
      changeItemsSheetSize,
    });
  }, [
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allSheets} />
    </AdminAuthLayout>
  );
}
