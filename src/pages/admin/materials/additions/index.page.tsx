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
    openUpdatalApplicationModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    addNewApplicationThicknesSizeByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewAddition,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
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
      openUpdatalApplicationModal,
      selectedEditItem,
      openDeleteModal,
      selectedAddition,
      updateState,
      addNewApplicationThicknesSizeByCategoryName,
      onClickOpenHardboardSizeThicknessWidget,
      onChangeUpdateStateAddition,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewAddition,
      changeItemsApplicationThickness,
      setOpenUpdatalApplicationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
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
    openUpdatalApplicationModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    addNewApplicationThicknesSizeByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewAddition,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
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
