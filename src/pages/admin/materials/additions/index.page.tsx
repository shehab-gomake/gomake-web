import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialAdditionsState } from "./store/additions";
import { HeaderFilter } from "./header-filter";
import { useApplications } from "./use-additions";

export default function Additions() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(
    materialAdditionsState
  );
  const {
    headerTable,
    allAdditions,
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
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewAddition,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteAddition,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
    updateApplicationThicknessSize,
  } = useApplications();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allAdditions,
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
      onChangeUpdateStateAddition,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      setHardness,
      addNewAddition,
      changeItemsApplicationThickness,
      setOpenUpdatalApplicationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewApplicationThickness,
      addNewApplicationThicknessByCategoryName,
      deleteAddition,
      deleteApplicationThicknessSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateAddition,
      updateApplicationThicknessSize,
    });
  }, [
    headerTable,
    allAdditions,
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
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewAddition,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteAddition,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
    updateApplicationThicknessSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.additions.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allAdditions} />
    </AdminAuthLayout>
  );
}
