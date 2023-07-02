import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialSheetsState } from "./store/sheets";
import { HeaderFilter } from "./header-filter";
import { useSheets } from "./use-sheets";

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
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    isAddNewSheetWightSize,
    selectedSheetWeightSize,
    onChangeUpdateStateSheetWeights,
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
    deleteSheetweight,
    deleteSheetweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetweight,
    updateSheetWeightSizes,
    setIsAddNewSheetWightSize,
    onClickOpenSheetWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
    openDuplicateSheetModal,
    onOpnDuplicateModal,
    onCloseDuplicateModal,
    getSheets,
    duplicateWeight,
    duplicateWeightSize,
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
      openDeleteModal,
      selectedSheetWeight,
      updateState,
      isAddNewSheetWightSize,
      selectedSheetWeightSize,
      onChangeUpdateStateSheetWeights,
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
      deleteSheetweight,
      deleteSheetweightSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateSheetweight,
      updateSheetWeightSizes,
      setIsAddNewSheetWightSize,
      onClickOpenSheetWeightSizeWidget,
      addNewSheeWeightSizeByCategoryName,
      openDuplicateSheetModal,
      onOpnDuplicateModal,
      onCloseDuplicateModal,
      getSheets,
      duplicateWeight,
      duplicateWeightSize,
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
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    isAddNewSheetWightSize,
    selectedSheetWeightSize,
    onChangeUpdateStateSheetWeights,
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
    deleteSheetweight,
    deleteSheetweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetweight,
    updateSheetWeightSizes,
    setIsAddNewSheetWightSize,
    onClickOpenSheetWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
    openDuplicateSheetModal,
    onOpnDuplicateModal,
    onCloseDuplicateModal,
    getSheets,
    duplicateWeight,
    duplicateWeightSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allSheets} />
    </AdminAuthLayout>
  );
}
