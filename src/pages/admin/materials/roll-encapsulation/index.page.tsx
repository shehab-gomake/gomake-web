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
    isAddNewRollEncapsulationWights,
    openDeleteModal,
    selectedRollEncapsulationWeight,
    updateState,
    isAddNewRollEncapsulationWightSize,
    selectedRollEncapsulationWeightSize,
    onChangeUpdateStateRollEncapsulationWeights,
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
    setIsAddNewRollEncapsulationWights,
    addNewSheeWeightByCategoryName,
    deleteRollEncapsulationweight,
    deleteRollEncapsulationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateRollEncapsulationweight,
    updateRollEncapsulationWeightSizes,
    setIsAddNewRollEncapsulationWightSize,
    onClickOpenRollEncapsulationWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
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
      isAddNewRollEncapsulationWights,
      openDeleteModal,
      selectedRollEncapsulationWeight,
      updateState,
      isAddNewRollEncapsulationWightSize,
      selectedRollEncapsulationWeightSize,
      onChangeUpdateStateRollEncapsulationWeights,
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
      setIsAddNewRollEncapsulationWights,
      addNewSheeWeightByCategoryName,
      deleteRollEncapsulationweight,
      deleteRollEncapsulationweightSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateRollEncapsulationweight,
      updateRollEncapsulationWeightSizes,
      setIsAddNewRollEncapsulationWightSize,
      onClickOpenRollEncapsulationWeightSizeWidget,
      addNewSheeWeightSizeByCategoryName,
    });
  }, [
    headerTable,
    allRollEncapsulation,
    openAddRollEncapsulationModal,
    items,
    categoryName,
    openUpdateRollEncapsulationModal,
    selectedEditItem,
    isAddNewRollEncapsulationWights,
    openDeleteModal,
    selectedRollEncapsulationWeight,
    updateState,
    isAddNewRollEncapsulationWightSize,
    selectedRollEncapsulationWeightSize,
    onChangeUpdateStateRollEncapsulationWeights,
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
    setIsAddNewRollEncapsulationWights,
    addNewSheeWeightByCategoryName,
    deleteRollEncapsulationweight,
    deleteRollEncapsulationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateRollEncapsulationweight,
    updateRollEncapsulationWeightSizes,
    setIsAddNewRollEncapsulationWightSize,
    onClickOpenRollEncapsulationWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.encapsulationRoll.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allRollEncapsulation} />
    </AdminAuthLayout>
  );
}
