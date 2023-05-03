import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialRollEncapsulationState } from "./store/roll-encapsulation";
import { HeaderFilter } from "./header-filter";
import { useRollEncapsulation } from "./use-roll-encapsulation";

export default function RollEncapsulation() {
  const { t } = useTranslation();
  const setMaterialRollEncapsulationState = useSetRecoilState<any>(
    materialRollEncapsulationState
  );
  const {
    headerTable,
    allRollEncapsulation,
    openAddRollEncapsulationModal,
    items,
    categoryName,
    openUpdateRollEncapsulationModal,
    selectedEditItem,
    isAddNewRollEncapsulationThickness,
    openDeleteModal,
    selectedRollEncapsulationThickness,
    updateState,
    isAddNewRollEncapsulationWightSize,
    selectedRollEncapsulationThicknessSize,
    onChangeUpdateStateRollEncapsulationThicknesss,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierRollEncapsulation,
    changeItemsRollEncapsulationSize,
    setOpenUpdateRollEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewRollEncapsulationThickness,
    addNewSheeThicknessByCategoryName,
    deleteRollEncapsulationweight,
    deleteRollEncapsulationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateRollEncapsulationweight,
    updateRollEncapsulationThicknessSizes,
    setIsAddNewRollEncapsulationWightSize,
    onClickOpenRollEncapsulationThicknessSizeWidget,
    addNewSheeThicknessSizeByCategoryName,
  } = useRollEncapsulation();

  useEffect(() => {
    setMaterialRollEncapsulationState({
      headerTable,
      allRollEncapsulation,
      openAddRollEncapsulationModal,
      items,
      categoryName,
      openUpdateRollEncapsulationModal,
      selectedEditItem,
      isAddNewRollEncapsulationThickness,
      openDeleteModal,
      selectedRollEncapsulationThickness,
      updateState,
      isAddNewRollEncapsulationWightSize,
      selectedRollEncapsulationThicknessSize,
      onChangeUpdateStateRollEncapsulationThicknesss,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierRollEncapsulation,
      changeItemsRollEncapsulationSize,
      setOpenUpdateRollEncapsulationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewRollEncapsulationThickness,
      addNewSheeThicknessByCategoryName,
      deleteRollEncapsulationweight,
      deleteRollEncapsulationweightSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateRollEncapsulationweight,
      updateRollEncapsulationThicknessSizes,
      setIsAddNewRollEncapsulationWightSize,
      onClickOpenRollEncapsulationThicknessSizeWidget,
      addNewSheeThicknessSizeByCategoryName,
    });
  }, [
    headerTable,
    allRollEncapsulation,
    openAddRollEncapsulationModal,
    items,
    categoryName,
    openUpdateRollEncapsulationModal,
    selectedEditItem,
    isAddNewRollEncapsulationThickness,
    openDeleteModal,
    selectedRollEncapsulationThickness,
    updateState,
    isAddNewRollEncapsulationWightSize,
    selectedRollEncapsulationThicknessSize,
    onChangeUpdateStateRollEncapsulationThicknesss,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierRollEncapsulation,
    changeItemsRollEncapsulationSize,
    setOpenUpdateRollEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewRollEncapsulationThickness,
    addNewSheeThicknessByCategoryName,
    deleteRollEncapsulationweight,
    deleteRollEncapsulationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateRollEncapsulationweight,
    updateRollEncapsulationThicknessSizes,
    setIsAddNewRollEncapsulationWightSize,
    onClickOpenRollEncapsulationThicknessSizeWidget,
    addNewSheeThicknessSizeByCategoryName,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.encapsulationRoll.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allRollEncapsulation} />
    </AdminAuthLayout>
  );
}
