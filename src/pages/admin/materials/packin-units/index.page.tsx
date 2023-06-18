import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPackinUnitsState } from "./store/packin-units";
import { HeaderFilter } from "./header-filter";
import { useCanvasFrames } from "./use-packin-units";

export default function PackinUnits() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(
    materialPackinUnitsState
  );
  const {
    headerTable,
    allPackinUnit,
    openAddNewPackinUnitModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackinUnitSize,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackinUnitSize,
    onCloseAddNewPackinUnitsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinUnitSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinUnitSize,
    addNewPackinUnitSizeByCategoryName,
    deletePackinUnitSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinUnitSize,
  } = useCanvasFrames();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allPackinUnit,
      openAddNewPackinUnitModal,
      items,
      categoryName,
      openUpdatePlatModal,
      selectedEditItem,
      isAddNewPackinUnitSize,
      openDeleteModal,
      selectedPlatWeight,
      updateState,
      onChangeUpdateStatePackinUnitSize,
      onCloseAddNewPackinUnitsModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPackinUnitSize,
      setOpenUpdatePlatModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewPackinUnitSize,
      addNewPackinUnitSizeByCategoryName,
      deletePackinUnitSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePackinUnitSize,
    });
  }, [
    headerTable,
    allPackinUnit,
    openAddNewPackinUnitModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackinUnitSize,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackinUnitSize,
    onCloseAddNewPackinUnitsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinUnitSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinUnitSize,
    addNewPackinUnitSizeByCategoryName,
    deletePackinUnitSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinUnitSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.packinUnits.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allPackinUnit} />
    </AdminAuthLayout>
  );
}
