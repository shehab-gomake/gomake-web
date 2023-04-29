import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPlatsState } from "./store/plat";
import { HeaderFilter } from "./header-filter";
import { useSheets } from "./use-material-roll-printing";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(materialPlatsState);
  const {
    headerTable,
    allAllMaterialRollPrinting,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  } = useSheets();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allAllMaterialRollPrinting,
      openAddNewPlatModal,
      items,
      categoryName,
      openUpdateSheetModal,
      selectedEditItem,
      isAddNewSheetWights,
      openDeleteModal,
      selectedSheetWeight,
      updateState,
      onChangeUpdateStatePlatSize,
      onCloseAddNewPlatModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPlatsSize,
      setOpenUpdateSheetModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewSheetWights,
      addNewPlatSizeByCategoryName,
      deletePlatSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePlatSize,
    });
  }, [
    headerTable,
    allAllMaterialRollPrinting,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
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
