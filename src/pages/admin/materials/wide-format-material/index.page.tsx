import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialSheetsState } from "./store/sheets";
import { HeaderFilter } from "./header-filter";
import { useSheets } from "./use-wide-format-material";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialSheetsState = useSetRecoilState<any>(materialSheetsState);
  const {
    headerTable,
    allWideFormatMaterial,
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
  } = useSheets();

  useEffect(() => {
    setMaterialSheetsState({
      headerTable,
      allWideFormatMaterial,
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
    });
  }, [
    headerTable,
    allWideFormatMaterial,
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
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.wideFormatMaterial.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allWideFormatMaterial} />
    </AdminAuthLayout>
  );
}
