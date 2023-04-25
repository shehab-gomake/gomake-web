import { useTranslation } from "react-i18next";

import { AdminAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useSheets } from "./use-sheets";
import { HeaderFilter } from "./header-filter";
import { useSetRecoilState } from "recoil";
import { materialSheetsState } from "./store/sheets";
import { useEffect } from "react";
import { GoMakeDeleteModal } from "@/components";
import { UpdateSheetModal } from "./update-sheet-modal";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialSheetsState = useSetRecoilState<any>(materialSheetsState);
  const {
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewSheeWeightByCategoryName,
  } = useSheets();

  useEffect(() => {
    setMaterialSheetsState({
      headerTable,
      allSheets,
      openAddSheetModal,
      items,
      categoryName,
      openUpdateSheetModal,
      selectedEditItem,
      isAddNewSheetWights,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierSheet,
      changeItemsSheetSize,
      setOpenUpdateSheetModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewSheetWights,
      addNewSheeWeightByCategoryName,
    });
  }, [
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewSheeWeightByCategoryName,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allSheets} />
    </AdminAuthLayout>
  );
}
