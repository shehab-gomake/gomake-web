import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialSheetEncapsulationState } from "./store/sheet-encapsulation";
import { HeaderFilter } from "./header-filter";
import { useSheetEncapsulation } from "./use-sheet-encapsulation";

export default function SheetEncapsulation() {
  const { t } = useTranslation();
  const setMaterialSheetEncapsulationState = useSetRecoilState<any>(
    materialSheetEncapsulationState
  );
  const {
    headerTable,
    allSheetEncapsulation,
    openAddNewSheetEncapsulationModal,
    items,
    categoryName,
    openUpdateSheetEncapsulationModal,
    selectedEditItem,
    isAddNewSheetEncapsulationWights,
    openDeleteModal,
    selectedSheetEncapsulationWeight,
    updateState,
    onChangeUpdateStateSheetEncapsulationSize,
    onCloseAddNewSheetEncapsulationModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSheetEncapsulationSize,
    setOpenUpdateSheetEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetEncapsulationWights,
    addNewSheetEncapsulationSizeByCategoryName,
    deleteSheetEncapsulationSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetEncapsulationSize,
  } = useSheetEncapsulation();

  useEffect(() => {
    setMaterialSheetEncapsulationState({
      headerTable,
      allSheetEncapsulation,
      openAddNewSheetEncapsulationModal,
      items,
      categoryName,
      openUpdateSheetEncapsulationModal,
      selectedEditItem,
      isAddNewSheetEncapsulationWights,
      openDeleteModal,
      selectedSheetEncapsulationWeight,
      updateState,
      onChangeUpdateStateSheetEncapsulationSize,
      onCloseAddNewSheetEncapsulationModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSheetEncapsulationSize,
      setOpenUpdateSheetEncapsulationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewSheetEncapsulationWights,
      addNewSheetEncapsulationSizeByCategoryName,
      deleteSheetEncapsulationSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateSheetEncapsulationSize,
    });
  }, [
    headerTable,
    allSheetEncapsulation,
    openAddNewSheetEncapsulationModal,
    items,
    categoryName,
    openUpdateSheetEncapsulationModal,
    selectedEditItem,
    isAddNewSheetEncapsulationWights,
    openDeleteModal,
    selectedSheetEncapsulationWeight,
    updateState,
    onChangeUpdateStateSheetEncapsulationSize,
    onCloseAddNewSheetEncapsulationModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSheetEncapsulationSize,
    setOpenUpdateSheetEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetEncapsulationWights,
    addNewSheetEncapsulationSizeByCategoryName,
    deleteSheetEncapsulationSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetEncapsulationSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetEncapsulation.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allSheetEncapsulation} />
    </AdminAuthLayout>
  );
}
