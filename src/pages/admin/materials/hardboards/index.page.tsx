import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialHardboardsState } from "./store/hardboards";
import { HeaderFilter } from "./header-filter";
import { useHardboards } from "./use-hardboards";

export default function Hardboards() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(
    materialHardboardsState
  );
  const {
    headerTable,
    allLaminations,
    openAddHardboardsModal,
    items,
    categoryName,
    hardness,
    openUpdateHardboardModal,
    selectedEditItem,
    isAddNewHardboardSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selectedHardboardSizeThicknes,
    isAddNewHardboardSizeThickness,
    addNewHardboardSizeThicknesByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewHardboardSizeThickness,
    onChangeUpdateStateHardboardWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierHardboard,
    changeItemsHardboardnSize,
    setOpenUpdateHardboardModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewHardboardSizes,
    addNewHardboardSizeByCategoryName,
    deleteHardboardSize,
    deletelHardboardSizeThickness,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    UpdateHardboardSize,
    updateHardboardSizeThickness,
  } = useHardboards();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allLaminations,
      openAddHardboardsModal,
      items,
      categoryName,
      hardness,
      openUpdateHardboardModal,
      selectedEditItem,
      isAddNewHardboardSizes,
      openDeleteModal,
      selectedLaminationSize,
      updateState,
      selectedHardboardSizeThicknes,
      isAddNewHardboardSizeThickness,
      addNewHardboardSizeThicknesByCategoryName,
      onClickOpenHardboardSizeThicknessWidget,
      setIsAddNewHardboardSizeThickness,
      onChangeUpdateStateHardboardWeights,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      setHardness,
      addNewSupplierHardboard,
      changeItemsHardboardnSize,
      setOpenUpdateHardboardModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewHardboardSizes,
      addNewHardboardSizeByCategoryName,
      deleteHardboardSize,
      deletelHardboardSizeThickness,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      UpdateHardboardSize,
      updateHardboardSizeThickness,
    });
  }, [
    headerTable,
    allLaminations,
    openAddHardboardsModal,
    items,
    categoryName,
    hardness,
    openUpdateHardboardModal,
    selectedEditItem,
    isAddNewHardboardSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selectedHardboardSizeThicknes,
    isAddNewHardboardSizeThickness,
    addNewHardboardSizeThicknesByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewHardboardSizeThickness,
    onChangeUpdateStateHardboardWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierHardboard,
    changeItemsHardboardnSize,
    setOpenUpdateHardboardModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewHardboardSizes,
    addNewHardboardSizeByCategoryName,
    deleteHardboardSize,
    deletelHardboardSizeThickness,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    UpdateHardboardSize,
    updateHardboardSizeThickness,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.hardboards.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allLaminations} />
    </AdminAuthLayout>
  );
}
