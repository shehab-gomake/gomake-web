import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialWideFormatMaterialState } from "./store/wide-format-material";
import { HeaderFilter } from "./header-filter";
import { useWideFormatMaterial } from "./use-wide-format-material";

export default function WideFormatMaterial() {
  const { t } = useTranslation();
  const setMaterialWideFormatMaterialState = useSetRecoilState<any>(
    materialWideFormatMaterialState
  );
  const {
    headerTable,
    allWideFormatMaterial,
    openAddWideFormatMaterialModal,
    items,
    categoryName,
    openUpdateWideFormatMaterialModal,
    selectedEditItem,
    isAddNewWideFormatMaterialType,
    openDeleteModal,
    selectedWideFormatMaterialWeight,
    updateState,
    isAddNewWideFormatMaterialTypeSize,
    selectedWideFormatMaterialWeightSize,
    onChangeUpdateStateWideFormatMaterialWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierWideFormatMaterial,
    changeItemsWideFormatMaterialSize,
    setOpenUpdateWideFormatMaterialModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewWideFormatMaterialType,
    addNewSheeWeightByCategoryName,
    deleteWideFormatMaterialweight,
    deleteWideFormatMaterialweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateWideFormatMaterialweight,
    updateWideFormatMaterialWeightSizes,
    setIsAddNewWideFormatMaterialTypeSize,
    onClickOpenWideFormatMaterialWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  } = useWideFormatMaterial();

  useEffect(() => {
    setMaterialWideFormatMaterialState({
      headerTable,
      allWideFormatMaterial,
      openAddWideFormatMaterialModal,
      items,
      categoryName,
      openUpdateWideFormatMaterialModal,
      selectedEditItem,
      isAddNewWideFormatMaterialType,
      openDeleteModal,
      selectedWideFormatMaterialWeight,
      updateState,
      isAddNewWideFormatMaterialTypeSize,
      selectedWideFormatMaterialWeightSize,
      onChangeUpdateStateWideFormatMaterialWeights,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierWideFormatMaterial,
      changeItemsWideFormatMaterialSize,
      setOpenUpdateWideFormatMaterialModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewWideFormatMaterialType,
      addNewSheeWeightByCategoryName,
      deleteWideFormatMaterialweight,
      deleteWideFormatMaterialweightSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateWideFormatMaterialweight,
      updateWideFormatMaterialWeightSizes,
      setIsAddNewWideFormatMaterialTypeSize,
      onClickOpenWideFormatMaterialWeightSizeWidget,
      addNewSheeWeightSizeByCategoryName,
    });
  }, [
    headerTable,
    allWideFormatMaterial,
    openAddWideFormatMaterialModal,
    items,
    categoryName,
    openUpdateWideFormatMaterialModal,
    selectedEditItem,
    isAddNewWideFormatMaterialType,
    openDeleteModal,
    selectedWideFormatMaterialWeight,
    updateState,
    isAddNewWideFormatMaterialTypeSize,
    selectedWideFormatMaterialWeightSize,
    onChangeUpdateStateWideFormatMaterialWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierWideFormatMaterial,
    changeItemsWideFormatMaterialSize,
    setOpenUpdateWideFormatMaterialModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewWideFormatMaterialType,
    addNewSheeWeightByCategoryName,
    deleteWideFormatMaterialweight,
    deleteWideFormatMaterialweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateWideFormatMaterialweight,
    updateWideFormatMaterialWeightSizes,
    setIsAddNewWideFormatMaterialTypeSize,
    onClickOpenWideFormatMaterialWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.wideFormatMaterial.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allWideFormatMaterial} />
    </AdminAuthLayout>
  );
}
