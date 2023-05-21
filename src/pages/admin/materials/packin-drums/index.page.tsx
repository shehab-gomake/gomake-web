import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPackinDrumState } from "./store/packin-drum";
import { HeaderFilter } from "./header-filter";
import { usePackinDrum } from "./use-packin-drum";

export default function PackinDrum() {
  const { t } = useTranslation();
  const setMaterialPackinDrumState = useSetRecoilState<any>(
    materialPackinDrumState
  );
  const {
    headerTable,
    allPackinDrum,
    openAddNewPackinDrumModal,
    items,
    categoryName,
    openUpdatePackinDrumModal,
    selectedEditItem,
    isAddNewPackinDrumWights,
    openDeleteModal,
    selectedPackinDrumWeight,
    updateState,
    onChangeUpdateStatePackinDrumSize,
    onCloseAddNewPackinDrumModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinDrumSize,
    setOpenUpdatePackinDrumModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinDrumWights,
    addNewPackinDrumSizeByCategoryName,
    deletePackinDrumSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinDrumSize,
  } = usePackinDrum();

  useEffect(() => {
    setMaterialPackinDrumState({
      headerTable,
      allPackinDrum,
      openAddNewPackinDrumModal,
      items,
      categoryName,
      openUpdatePackinDrumModal,
      selectedEditItem,
      isAddNewPackinDrumWights,
      openDeleteModal,
      selectedPackinDrumWeight,
      updateState,
      onChangeUpdateStatePackinDrumSize,
      onCloseAddNewPackinDrumModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPackinDrumSize,
      setOpenUpdatePackinDrumModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewPackinDrumWights,
      addNewPackinDrumSizeByCategoryName,
      deletePackinDrumSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePackinDrumSize,
    });
  }, [
    headerTable,
    allPackinDrum,
    openAddNewPackinDrumModal,
    items,
    categoryName,
    openUpdatePackinDrumModal,
    selectedEditItem,
    isAddNewPackinDrumWights,
    openDeleteModal,
    selectedPackinDrumWeight,
    updateState,
    onChangeUpdateStatePackinDrumSize,
    onCloseAddNewPackinDrumModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinDrumSize,
    setOpenUpdatePackinDrumModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinDrumWights,
    addNewPackinDrumSizeByCategoryName,
    deletePackinDrumSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinDrumSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.packinDrums.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allPackinDrum} />
    </AdminAuthLayout>
  );
}
