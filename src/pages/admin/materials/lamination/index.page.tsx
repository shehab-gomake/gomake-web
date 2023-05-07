import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialLaminationState } from "./store/lamination";
import { HeaderFilter } from "./header-filter";
import { useLamination } from "./use-lamination";

export default function Lamination() {
  const { t } = useTranslation();
  const setMaterialLaminationState = useSetRecoilState<any>(
    materialLaminationState
  );
  const {
    headerTable,
    allLamination,
    openAddLaminationModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationWights,
    openDeleteModal,
    selectedLaminationWeight,
    updateState,
    isAddNewLaminationWightSize,
    selectedLaminationWeightSize,
    onChangeUpdateStateLaminationWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierLamination,
    changeItemsLaminationSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationWights,
    addNewSheeWeightByCategoryName,
    deleteLaminationweight,
    deleteLaminationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateLaminationweight,
    updateLaminationWeightSizes,
    setIsAddNewLaminationWightSize,
    onClickOpenLaminationWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  } = useLamination();

  useEffect(() => {
    setMaterialLaminationState({
      headerTable,
      allLamination,
      openAddLaminationModal,
      items,
      categoryName,
      openUpdateLaminationModal,
      selectedEditItem,
      isAddNewLaminationWights,
      openDeleteModal,
      selectedLaminationWeight,
      updateState,
      isAddNewLaminationWightSize,
      selectedLaminationWeightSize,
      onChangeUpdateStateLaminationWeights,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewSupplierLamination,
      changeItemsLaminationSize,
      setOpenUpdateLaminationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewLaminationWights,
      addNewSheeWeightByCategoryName,
      deleteLaminationweight,
      deleteLaminationweightSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateLaminationweight,
      updateLaminationWeightSizes,
      setIsAddNewLaminationWightSize,
      onClickOpenLaminationWeightSizeWidget,
      addNewSheeWeightSizeByCategoryName,
    });
  }, [
    headerTable,
    allLamination,
    openAddLaminationModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationWights,
    openDeleteModal,
    selectedLaminationWeight,
    updateState,
    isAddNewLaminationWightSize,
    selectedLaminationWeightSize,
    onChangeUpdateStateLaminationWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierLamination,
    changeItemsLaminationSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationWights,
    addNewSheeWeightByCategoryName,
    deleteLaminationweight,
    deleteLaminationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateLaminationweight,
    updateLaminationWeightSizes,
    setIsAddNewLaminationWightSize,
    onClickOpenLaminationWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.lamination.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allLamination} />
    </AdminAuthLayout>
  );
}
