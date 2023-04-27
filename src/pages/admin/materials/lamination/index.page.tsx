import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialLaminationsState } from "./store/lamination";
import { HeaderFilter } from "./header-filter";
import { useLaminations } from "./use-lamination";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialSheetsState = useSetRecoilState<any>(
    materialLaminationsState
  );
  const {
    headerTable,
    allLaminations,
    openAddLaminationModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    onChangeUpdateStateSheetWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierLamination,
    changeItemsSheetSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationSizes,
    addNewSheeWeightByCategoryName,
    deleteLaminationSize,
    deletelLaminationSizeThickness,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateLaminationSize,
    updateLaminationSizeThickness,
  } = useLaminations();

  useEffect(() => {
    setMaterialSheetsState({
      headerTable,
      allLaminations,
      openAddLaminationModal,
      items,
      categoryName,
      openUpdateLaminationModal,
      selectedEditItem,
      isAddNewLaminationSizes,
      openDeleteModal,
      selectedLaminationSize,
      updateState,
      onChangeUpdateStateSheetWeights,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierLamination,
      changeItemsSheetSize,
      setOpenUpdateLaminationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewLaminationSizes,
      addNewSheeWeightByCategoryName,
      deleteLaminationSize,
      deletelLaminationSizeThickness,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateLaminationSize,
      updateLaminationSizeThickness,
    });
  }, [
    headerTable,
    allLaminations,
    openAddLaminationModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    onChangeUpdateStateSheetWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierLamination,
    changeItemsSheetSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationSizes,
    addNewSheeWeightByCategoryName,
    deleteLaminationSize,
    deletelLaminationSizeThickness,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateLaminationSize,
    updateLaminationSizeThickness,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.lamination.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allLaminations} />
    </AdminAuthLayout>
  );
}
