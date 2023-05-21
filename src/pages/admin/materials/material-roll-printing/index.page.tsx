import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialMaterialRollPrintingState } from "./store/material-roll-printing";
import { HeaderFilter } from "./header-filter";
import { useMaterialRollPrinting } from "./use-material-roll-printing";

export default function MaterialRollPrinting() {
  const { t } = useTranslation();
  const setMaterialMaterialRollPrintingState = useSetRecoilState<any>(
    materialMaterialRollPrintingState
  );
  const {
    headerTable,
    allAllMaterialRollPrinting,
    openAddNewMaterialRollPrintingModal,
    items,
    categoryName,
    openUpdateMaterialRollPrintingModal,
    selectedEditItem,
    isAddNewMaterialRollPrintingWights,
    openDeleteModal,
    selectedMaterialRollPrintingWeight,
    updateState,
    onChangeUpdateStateMaterialRollPrintingSize,
    onCloseAddNewMaterialRollPrintingModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewMaterialRollPrintingsSize,
    setOpenUpdateMaterialRollPrintingModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewMaterialRollPrintingWights,
    addNewMaterialRollPrintingSizeByCategoryName,
    deleteMaterialRollPrintingSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMaterialRollPrintingSize,
  } = useMaterialRollPrinting();

  useEffect(() => {
    setMaterialMaterialRollPrintingState({
      headerTable,
      allAllMaterialRollPrinting,
      openAddNewMaterialRollPrintingModal,
      items,
      categoryName,
      openUpdateMaterialRollPrintingModal,
      selectedEditItem,
      isAddNewMaterialRollPrintingWights,
      openDeleteModal,
      selectedMaterialRollPrintingWeight,
      updateState,
      onChangeUpdateStateMaterialRollPrintingSize,
      onCloseAddNewMaterialRollPrintingModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewMaterialRollPrintingsSize,
      setOpenUpdateMaterialRollPrintingModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewMaterialRollPrintingWights,
      addNewMaterialRollPrintingSizeByCategoryName,
      deleteMaterialRollPrintingSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateMaterialRollPrintingSize,
    });
  }, [
    headerTable,
    allAllMaterialRollPrinting,
    openAddNewMaterialRollPrintingModal,
    items,
    categoryName,
    openUpdateMaterialRollPrintingModal,
    selectedEditItem,
    isAddNewMaterialRollPrintingWights,
    openDeleteModal,
    selectedMaterialRollPrintingWeight,
    updateState,
    onChangeUpdateStateMaterialRollPrintingSize,
    onCloseAddNewMaterialRollPrintingModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewMaterialRollPrintingsSize,
    setOpenUpdateMaterialRollPrintingModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewMaterialRollPrintingWights,
    addNewMaterialRollPrintingSizeByCategoryName,
    deleteMaterialRollPrintingSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMaterialRollPrintingSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.printingMaterials.admin.title")} />
      <HeaderFilter />
      <Table
        tableHeaders={headerTable}
        tableRows={allAllMaterialRollPrinting}
      />
    </AdminAuthLayout>
  );
}
