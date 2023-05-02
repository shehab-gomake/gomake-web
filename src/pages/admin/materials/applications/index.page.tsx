import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialApplicationsState } from "./store/applications";
import { HeaderFilter } from "./header-filter";
import { useApplications } from "./use-applications";

export default function Applications() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(
    materialApplicationsState
  );
  const {
    headerTable,
    allApplications,
    openAddApplicationsModal,
    items,
    categoryName,
    hardness,
    openUpdatalApplicationModal,
    selectedEditItem,
    isAddNewApplicationThickness,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selecteApplicationThicknessSize,
    isAddNeApplicationThicknessSize,
    addNewApplicationThicknesSizeByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewApplicationThicknessSize,
    onChangeUpdateStateApplicationThickness,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierApplication,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteApplicationThickness,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateApplicationThickness,
    updateApplicationThicknessSize,
  } = useApplications();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allApplications,
      openAddApplicationsModal,
      items,
      categoryName,
      hardness,
      openUpdatalApplicationModal,
      selectedEditItem,
      isAddNewApplicationThickness,
      openDeleteModal,
      selectedLaminationSize,
      updateState,
      selecteApplicationThicknessSize,
      isAddNeApplicationThicknessSize,
      addNewApplicationThicknesSizeByCategoryName,
      onClickOpenHardboardSizeThicknessWidget,
      setIsAddNewApplicationThicknessSize,
      onChangeUpdateStateApplicationThickness,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      setHardness,
      addNewSupplierApplication,
      changeItemsApplicationThickness,
      setOpenUpdatalApplicationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewApplicationThickness,
      addNewApplicationThicknessByCategoryName,
      deleteApplicationThickness,
      deleteApplicationThicknessSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateApplicationThickness,
      updateApplicationThicknessSize,
    });
  }, [
    headerTable,
    allApplications,
    openAddApplicationsModal,
    items,
    categoryName,
    hardness,
    openUpdatalApplicationModal,
    selectedEditItem,
    isAddNewApplicationThickness,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selecteApplicationThicknessSize,
    isAddNeApplicationThicknessSize,
    addNewApplicationThicknesSizeByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewApplicationThicknessSize,
    onChangeUpdateStateApplicationThickness,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierApplication,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteApplicationThickness,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateApplicationThickness,
    updateApplicationThicknessSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.applications.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allApplications} />
    </AdminAuthLayout>
  );
}
