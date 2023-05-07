import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPackingsState } from "./store/packings";
import { HeaderFilter } from "./header-filter";
import { useCanvasFrames } from "./use-packin-units";

export default function PackinUnits() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(materialPackingsState);
  const {
    headerTable,
    allPackin,
    openAddNewPackingModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackingVolume,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackingVolume,
    onCloseAddNewPackingsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPacking,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackingVolume,
    addNewPackingVolumeByCategoryName,
    deletePackingVolume,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackingVolume,
  } = useCanvasFrames();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allPackin,
      openAddNewPackingModal,
      items,
      categoryName,
      openUpdatePlatModal,
      selectedEditItem,
      isAddNewPackingVolume,
      openDeleteModal,
      selectedPlatWeight,
      updateState,
      onChangeUpdateStatePackingVolume,
      onCloseAddNewPackingsModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPacking,
      setOpenUpdatePlatModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewPackingVolume,
      addNewPackingVolumeByCategoryName,
      deletePackingVolume,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePackingVolume,
    });
  }, [
    headerTable,
    allPackin,
    openAddNewPackingModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackingVolume,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackingVolume,
    onCloseAddNewPackingsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPacking,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackingVolume,
    addNewPackingVolumeByCategoryName,
    deletePackingVolume,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackingVolume,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.packings.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allPackin} />
    </AdminAuthLayout>
  );
}
