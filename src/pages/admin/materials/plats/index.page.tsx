import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPlatsState } from "./store/plat";
import { HeaderFilter } from "./header-filter";
import { useSheets } from "./use-plats";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialSheetsState = useSetRecoilState<any>(materialPlatsState);
  const {
    headerTable,
    allPlats,
    openAddNewPlatModal,
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
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
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
      allPlats,
      openAddNewPlatModal,
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
      onCloseAddNewPlatModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPlatsSize,
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
    allPlats,
    openAddNewPlatModal,
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
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
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
      <HeaderTitle title={t("materials.plat.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allPlats} />
    </AdminAuthLayout>
  );
}
